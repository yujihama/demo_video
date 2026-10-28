"""Assemble audit_future_v4 from a cut list (JSON), v4: variable cut lengths, hard cuts by default,
UI/room sound design, BGM ducking under narration, and one colour grade over every frame.

  python_embeded\\python.exe production\\audit_future_v4\\build.py --cut production\\audit_future_v4\\cut_final.json --out end-card\\demo\\audit_future_v4_high.mp4

Cut list format (one object per cut):
  {"clip": "path relative to workspace",   # Remotion screen, H3 clip or composite
   "frames": 192,                          # frames used from the clip (default 192)
   "offset": 0,                            # frames skipped at the start of the clip (default 0)
   "xfade": 0,                             # crossfade INTO this cut, in frames (default 0 = hard cut)
   "play": 136,                            # optional: source frames to use; the rest of "frames" is the tail at half speed
   "nar": ["02"],                          # narration ids placed 0.5 s after the cut starts
   "sfx": [{"f": 72, "kind": "tap"}]}      # UI sounds at clip-relative frames: tap, swipe, arrive, chime, send, hum:<frames>
Audio of source clips is ignored.
"""
import argparse
from fractions import Fraction
import hashlib
import importlib.util
import json
from pathlib import Path

import av
import numpy as np

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
FPS, RATE = 24, 48000
W, H = 1920, 1080
HEAD_SILENCE = 0.5
spec = importlib.util.spec_from_file_location("audio_helpers", HERE.parent / "audit_knowledge/build.py")
helpers = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helpers)


def clip_frames(path, frames=192, offset=0):
    """Yield exactly `frames` 1080p RGB float32 frames from `path`, starting at `offset`; hold the last frame if short."""
    last = None
    n = 0
    with av.open(str(path)) as container:
        skipped = 0
        for frame in container.decode(video=0):
            if skipped < offset:
                skipped += 1
                continue
            rgb = frame.to_ndarray(format="rgb24")
            height, width = rgb.shape[:2]
            if width * 9 >= height * 16:
                crop_w = height * 16 // 9
                left = (width - crop_w) // 2
                out = rgb[:, left:left + crop_w]
            else:
                crop_h = width * 9 // 16
                top = (height - crop_h) // 2
                out = rgb[top:top + crop_h]
            if (width, height) == (1600, 1200):  # tablet renders are used whole (4:3), not cropped
                out = rgb
            img = av.VideoFrame.from_ndarray(np.ascontiguousarray(out), format="rgb24")
            if out.shape[1] == 1600:
                last = img.to_ndarray(format="rgb24").astype(np.float32)
            else:
                last = img.reformat(width=W, height=H, format="rgb24", interpolation="LANCZOS").to_ndarray(format="rgb24").astype(np.float32)
            yield last
            n += 1
            if n == frames:
                return
    while n < frames and last is not None:
        yield last
        n += 1


def cut_frames(path, frames=192, offset=0, play=None):
    """Like clip_frames, but only `play` source frames are used; when `frames` is longer, the last
    (frames - play) source frames are stretched to twice their length with linear blending, so the
    cut ramps into half speed instead of freezing or showing unusable footage."""
    if not play or play >= frames:
        yield from clip_frames(path, frames=frames, offset=offset)
        return
    extra = frames - play
    src = list(clip_frames(path, frames=play, offset=offset))
    head, tail = src[:play - extra], src[play - extra:]
    for img in head:
        yield img
    for k in range(2 * extra):
        pos = k / 2
        i = min(int(pos), len(tail) - 1)
        j = min(i + 1, len(tail) - 1)
        t = pos - i
        yield tail[i] * (1 - t) + tail[j] * t


# ---------- sound design (synthesised, no external assets) ----------

def _env(n, attack, decay):
    t = np.arange(n) / RATE
    return np.minimum(t / max(attack, 1e-4), 1.0) * np.exp(-t / max(decay, 1e-4))


def sfx(kind, rng):
    """Short UI sounds, stereo float32, peak around 0.3."""
    if kind == "tap":
        n = int(0.09 * RATE); t = np.arange(n) / RATE
        s = np.sin(2 * np.pi * 1350 * t) * _env(n, 0.001, 0.012) * 0.5 + rng.normal(0, 1, n) * _env(n, 0.0005, 0.004) * 0.25
        s += np.sin(2 * np.pi * 160 * t) * _env(n, 0.002, 0.03) * 0.35
    elif kind == "swipe":
        n = int(0.22 * RATE); t = np.arange(n) / RATE
        noise = rng.normal(0, 1, n)
        # one-pole lowpass whose cutoff rises during the swipe
        out = np.zeros(n); y = 0.0
        for i in range(n):
            a = 0.02 + 0.25 * (i / n)
            y += a * (noise[i] - y); out[i] = y
        s = out * np.sin(np.pi * t / t[-1]) * 1.6
    elif kind == "arrive":
        n = int(0.16 * RATE); t = np.arange(n) / RATE
        s = np.sin(2 * np.pi * 210 * t) * _env(n, 0.003, 0.05) * 0.6 + np.sin(2 * np.pi * 1050 * t) * _env(n, 0.001, 0.02) * 0.15
    elif kind == "chime":
        n = int(0.7 * RATE); t = np.arange(n) / RATE
        s = (np.sin(2 * np.pi * 880 * t) * 0.5 + np.sin(2 * np.pi * 1318 * t) * 0.3 + np.sin(2 * np.pi * 1760 * t) * 0.12) * _env(n, 0.004, 0.22)
    elif kind == "send":
        n = int(0.3 * RATE); t = np.arange(n) / RATE
        f = 620 + 420 * (t / t[-1])
        s = np.sin(2 * np.pi * np.cumsum(f) / RATE) * _env(n, 0.005, 0.09) * 0.5
    elif kind.startswith("hum:"):
        n = int(int(kind.split(":")[1]) / FPS * RATE); t = np.arange(n) / RATE
        s = (np.sin(2 * np.pi * 92 * t) * 0.6 + np.sin(2 * np.pi * 184 * t) * 0.25 + np.sin(2 * np.pi * 276 * t) * 0.1)
        s *= 0.5 + 0.5 * np.sin(2 * np.pi * t / 2.4 - np.pi / 2)  # breathes with the line on screen
        edge = int(0.3 * RATE)
        s[:edge] *= np.linspace(0, 1, edge); s[-edge:] *= np.linspace(1, 0, edge)
        s *= 0.35
    else:
        raise ValueError(kind)
    s = s / max(float(np.max(np.abs(s))), 1e-9) * (0.9 if kind.startswith("hum") else 0.3)
    return np.stack([s, s]).astype(np.float32)


def room_tone(length, rng):
    """Office air: brown-ish noise, very quiet, slightly stereo."""
    out = np.zeros((2, length), dtype=np.float32)
    for ch in range(2):
        white = rng.normal(0, 1, length).astype(np.float32)
        y = np.zeros(length, dtype=np.float32); acc = 0.0
        a = 0.015
        for i in range(0, length, 4096):
            seg = white[i:i + 4096]
            res = np.empty_like(seg)
            for j in range(len(seg)):
                acc += a * (seg[j] - acc); res[j] = acc
            y[i:i + 4096] = res
        out[ch] = y / max(float(np.max(np.abs(y))), 1e-9)
    return out


def audio_mix(cuts, starts, total_frames):
    length = int(total_frames / FPS * RATE)
    rng = np.random.default_rng(7)
    music = helpers.read_audio(ROOT / "end-card/public/accounting-future-v3/bgm.wav")
    music = np.tile(music, (1, int(np.ceil(length / music.shape[1]))))[:, :length]
    music *= 10 ** (-36 / 20) / max(float(np.sqrt(np.mean(music ** 2))), 1e-9)
    music[:, :RATE] *= np.linspace(0, 1, RATE)
    music[:, -3 * RATE:] *= np.linspace(1, 0, 3 * RATE)
    plan = {item["id"]: item for item in json.loads((HERE / "narration.json").read_text(encoding="utf-8"))}
    placements = []
    for cut, start in zip(cuts, starts):
        offset = start / FPS + HEAD_SILENCE
        for nid in cut.get("nar", []):
            placements.append((nid, offset))
            voice = helpers.read_audio(HERE / "audio" / f"nar{nid}.wav")
            offset += voice.shape[1] / RATE + 0.6
    voices = {nid: helpers.read_audio(HERE / "audio" / f"nar{nid}.wav") for nid, _ in placements}
    joined = np.concatenate(list(voices.values()), axis=1)
    gain = min(10 ** (-19 / 20) / max(float(np.sqrt(np.mean(joined ** 2))), 1e-9), .85 / max(float(np.max(np.abs(joined))), 1e-9))
    voice_track = np.zeros((2, length), dtype=np.float32)
    duck = np.zeros(length, dtype=np.float32)
    records = []
    for nid, start_s in placements:
        voice = voices[nid] * gain
        edge = int(.01 * RATE)
        voice[:, :edge] *= np.linspace(0, 1, edge)
        voice[:, -edge:] *= np.linspace(1, 0, edge)
        s0 = round(start_s * RATE)
        s1 = min(s0 + voice.shape[1], length)
        voice_track[:, s0:s1] += voice[:, :s1 - s0]
        duck[max(0, s0 - int(0.25 * RATE)):min(length, s1 + int(0.5 * RATE))] = 1.0
        records.append({"id": nid, "text": plan[nid]["text"], "start": round(start_s, 3), "end": round(s1 / RATE, 3)})
    # Smooth the ducking envelope (attack/release ~0.3 s) and drop the music by 7 dB under speech.
    kernel = np.ones(int(0.3 * RATE), dtype=np.float32); kernel /= kernel.size
    duck = np.convolve(duck, kernel, mode="same")
    music *= (1.0 - duck * (1.0 - 10 ** (-7 / 20)))[None, :]
    # Room tone and UI sounds.
    tone = room_tone(length, rng) * 10 ** (-50 / 20)
    fx = np.zeros((2, length), dtype=np.float32)
    for cut, start in zip(cuts, starts):
        for item in cut.get("sfx", []):
            s = sfx(item["kind"], rng) * 10 ** (item.get("db", -26) / 20)
            s0 = int((start + item["f"]) / FPS * RATE)
            s1 = min(s0 + s.shape[1], length)
            if s1 > s0:
                fx[:, s0:s1] += s[:, :s1 - s0]
    mix = music + voice_track + tone + fx
    peak = float(np.max(np.abs(mix)))
    if peak > .94:
        mix *= .94 / peak
    return np.ascontiguousarray(mix, dtype=np.float32), records


# ---------- colour grade ----------

_vignette = None


def grade(rgb, rng):
    """One look for every source: gentle S-curve, teal shadows / warm highlights, soft vignette, fine grain."""
    global _vignette
    if _vignette is None:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
        _vignette = (1.0 - 0.16 * np.clip(r - 0.45, 0, 1) ** 1.5)[..., None]
    x = rgb / 255.0
    x = x + 0.06 * (x - 0.5) * (1 - np.abs(2 * x - 1))        # mild contrast around mid-grey
    lum = x.mean(axis=2, keepdims=True)
    shadow = np.clip(1 - lum * 2.2, 0, 1)
    high = np.clip(lum * 1.4 - 0.5, 0, 1)
    x = x + shadow * np.array([-0.010, 0.006, 0.014], dtype=np.float32) + high * np.array([0.012, 0.004, -0.010], dtype=np.float32)
    x = x * _vignette
    x = x + rng.normal(0, 0.006, size=(H // 2, W // 2, 1)).repeat(2, axis=0).repeat(2, axis=1).astype(np.float32)
    return np.clip(x, 0, 1) * 255.0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cut", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--no-grade", action="store_true")
    args = parser.parse_args()
    cuts = json.loads(Path(args.cut).read_text(encoding="utf-8"))
    output = ROOT / args.out if not Path(args.out).is_absolute() else Path(args.out)
    if output.exists():
        raise FileExistsError(f"Keep the existing render; choose a new --out: {output}")
    for cut in cuts:
        if not (ROOT / cut["clip"]).exists():
            raise FileNotFoundError(cut["clip"])
    lengths = [int(cut.get("frames", 192)) for cut in cuts]
    xfades = [int(cut.get("xfade", 0)) for cut in cuts]
    starts = []
    pos = 0
    for i, n in enumerate(lengths):
        if i:
            pos -= xfades[i]
        starts.append(pos)
        pos += n
    total = pos
    audio, placements = audio_mix(cuts, starts, total)
    generators = [cut_frames(ROOT / cut["clip"], frames=lengths[i], offset=int(cut.get("offset", 0)), play=cut.get("play")) for i, cut in enumerate(cuts)]
    rng = np.random.default_rng(11)
    with av.open(str(output), "w", options={"movflags": "+faststart"}) as container:
        container.metadata["comment"] = "AI-assisted fictional audit concept film. All companies, figures and documents are fictional."
        video = container.add_stream("libx264", rate=FPS, options={"crf": "18", "preset": "medium"})
        video.width, video.height, video.pix_fmt = W, H, "yuv420p"
        video.codec_context.thread_count = 4
        sound = container.add_stream("aac", rate=RATE)
        sound.layout, sound.bit_rate = "stereo", 192000
        audio_position = 0
        for index in range(total):
            active = [i for i in range(len(cuts)) if starts[i] <= index < starts[i] + lengths[i]]
            frames = [next(generators[i]) for i in active]
            if len(frames) == 2:
                alpha = (index - starts[active[1]] + 1) / max(1, xfades[active[1]])
                rgb = frames[0] * (1 - alpha) + frames[1] * alpha
            else:
                rgb = frames[0]
            if not args.no_grade:
                rgb = grade(rgb, rng)
            fade = min(1., index / 8, (total - 1 - index) / 18)
            if fade < 1:
                rgb = rgb * fade
            frame = av.VideoFrame.from_ndarray(np.rint(rgb).astype(np.uint8), format="rgb24").reformat(format="yuv420p")
            frame.pts, frame.time_base = index, Fraction(1, FPS)
            for packet in video.encode(frame):
                container.mux(packet)
            desired = min(round((index + 1) * RATE / FPS), audio.shape[1])
            while audio_position + 1024 <= desired:
                af = av.AudioFrame.from_ndarray(np.ascontiguousarray(audio[:, audio_position:audio_position + 1024]), format="fltp", layout="stereo")
                af.sample_rate, af.pts, af.time_base = RATE, audio_position, Fraction(1, RATE)
                for packet in sound.encode(af):
                    container.mux(packet)
                audio_position += 1024
            if index % 240 == 0:
                print(f"Encoded {index}/{total}", flush=True)
        if audio_position < audio.shape[1]:
            af = av.AudioFrame.from_ndarray(np.ascontiguousarray(audio[:, audio_position:]), format="fltp", layout="stereo")
            af.sample_rate, af.pts, af.time_base = RATE, audio_position, Fraction(1, RATE)
            for packet in sound.encode(af):
                container.mux(packet)
        for packet in video.encode():
            container.mux(packet)
        for packet in sound.encode():
            container.mux(packet)
    for generator in generators:
        generator.close()
    report = {"output": str(output), "frames": total, "seconds": total / FPS, "starts": starts, "cuts": cuts, "narration": placements,
              "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}
    (output.with_suffix(".manifest.json")).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"output": str(output), "seconds": total / FPS}), flush=True)


if __name__ == "__main__":
    main()
