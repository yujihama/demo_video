"""Single-take narration for audit_future_v3.

All lines are synthesized in ONE request (same voice, pace and tone), separated by pauses,
then split on silences into audio/narNN.wav. No per-line time pressure in the instructions.
The key is read from the environment or the workspace .env.local and never recorded.
"""
import hashlib
import json
import os
import urllib.error
import urllib.request
from pathlib import Path

import av
import numpy as np

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
VOICE = "cedar"
RATE = 48000
STYLE = ("日本人の40代男性ナレーター。企業向けコンセプト映像の語り。落ち着いて明瞭、穏やかで押しつけがましくない。"
         "全体を通して同じ声の張り、同じゆったりした速さを保つ。各行の終わりで文を言い切り、行と行の間に1.5秒ほどの間を置く。"
         "広告の煽りや演説調にしない。声だけで、音楽や環境音は付けない。")


def read_mono(path):
    chunks = []
    resampler = av.AudioResampler(format="flt", layout="mono", rate=RATE)
    with av.open(str(path)) as container:
        for frame in container.decode(audio=0):
            for converted in resampler.resample(frame):
                chunks.append(converted.to_ndarray()[0])
        for converted in resampler.resample(None):
            chunks.append(converted.to_ndarray()[0])
    return np.concatenate(chunks)


def write_wav(path, mono):
    stereo = np.ascontiguousarray(np.stack([mono, mono]).astype(np.float32))
    with av.open(str(path), "w") as container:
        stream = container.add_stream("pcm_s16le", rate=RATE)
        stream.layout = "stereo"
        frame = av.AudioFrame.from_ndarray(stereo, format="fltp", layout="stereo")
        frame.sample_rate = RATE
        for packet in stream.encode(frame):
            container.mux(packet)
        for packet in stream.encode():
            container.mux(packet)


def split_on_silence(mono, expected, min_gap=0.6, threshold_db=-45):
    win = int(0.02 * RATE)
    frames = len(mono) // win
    rms = np.sqrt(np.mean(mono[:frames * win].reshape(frames, win) ** 2, axis=1) + 1e-12)
    loud = 20 * np.log10(rms) > threshold_db
    segments, start, quiet_run = [], None, 0
    min_gap_frames = int(min_gap / 0.02)
    for i, is_loud in enumerate(loud):
        if is_loud:
            if start is None:
                start = i
            quiet_run = 0
        else:
            if start is not None:
                quiet_run += 1
                if quiet_run >= min_gap_frames:
                    segments.append((start, i - quiet_run + 1))
                    start, quiet_run = None, 0
    if start is not None:
        segments.append((start, frames))
    # Merge the smallest gaps if we found too many segments (pauses inside a sentence).
    while len(segments) > expected:
        gaps = [(segments[k + 1][0] - segments[k][1], k) for k in range(len(segments) - 1)]
        _, k = min(gaps)
        segments[k:k + 2] = [(segments[k][0], segments[k + 1][1])]
    pad = int(0.08 * RATE)
    return [(max(0, a * win - pad), min(len(mono), b * win + pad)) for a, b in segments]


def main():
    key = os.environ.get("OPENAI_API_KEY", "")
    if not key:
        env = ROOT / ".env.local"
        if env.exists():
            for line in env.read_text(encoding="utf-8-sig").splitlines():
                if line.strip().startswith("OPENAI_API_KEY="):
                    key = line.split("=", 1)[1].strip().strip("'\"")
                    break
    if not key:
        raise SystemExit("No existing project key; nothing sent.")
    plan = json.loads((HERE / "narration.json").read_text(encoding="utf-8"))
    out = HERE / "audio"
    out.mkdir(exist_ok=True)
    take = out / "full_take.wav"
    if not take.exists():
        script = "\n\n".join(item["text"] for item in plan)
        body = {"model": "gpt-4o-mini-tts", "voice": VOICE, "input": script,
                "response_format": "wav", "instructions": STYLE}
        req = urllib.request.Request("https://api.openai.com/v1/audio/speech",
                                     data=json.dumps(body, ensure_ascii=False).encode(),
                                     headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                                     method="POST")
        try:
            with urllib.request.urlopen(req, timeout=180) as response:
                take.write_bytes(response.read())
        except urllib.error.HTTPError as error:
            raise SystemExit(f"TTS HTTP {error.code}; details withheld.") from None
    mono = read_mono(take)
    segments = split_on_silence(mono, len(plan))
    if len(segments) != len(plan):
        raise SystemExit(f"Found {len(segments)} segments for {len(plan)} lines; adjust the pause threshold.")
    records = []
    for item, (a, b) in zip(plan, segments):
        piece = mono[a:b]
        write_wav(out / f"nar{item['id']}.wav", piece)
        seconds = len(piece) / RATE
        chars = len(item["text"].replace("、", "").replace("。", ""))
        records.append({**item, "duration_seconds": round(seconds, 3), "chars": chars,
                        "chars_per_second": round(chars / seconds, 2), "fits": seconds <= 7.3})
    rates = np.array([r["chars_per_second"] for r in records])
    mean = float(rates.mean())
    for r in records:
        r["rate_deviation_pct"] = round((r["chars_per_second"] - mean) / mean * 100, 1)
    summary = {"take_seconds": round(len(mono) / RATE, 2), "mean_chars_per_second": round(mean, 2),
               "sha256_take": hashlib.sha256(take.read_bytes()).hexdigest(), "lines": records}
    (out / "manifest.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    for r in records:
        print(json.dumps({"id": r["id"], "seconds": r["duration_seconds"], "cps": r["chars_per_second"],
                          "dev%": r["rate_deviation_pct"], "fits": r["fits"]}, ensure_ascii=False), flush=True)
    if not all(r["fits"] for r in records):
        raise SystemExit("Some lines exceed 7.3 s; shorten text and delete audio/full_take.wav to regenerate.")


if __name__ == "__main__":
    main()
