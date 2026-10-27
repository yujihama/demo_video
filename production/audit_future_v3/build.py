"""Assemble audit_future_v3 from a cut list (JSON): any mix of Remotion screen clips and H3 clips.

  python_embeded\\python.exe production\\audit_future_v3\\build.py --cut production\\audit_future_v3\\cut_screens.json --out end-card\\demo\\audit_future_v3_screens_preview.mp4

Cut list format: [{"clip": "path relative to workspace", "nar": ["02"]}, ...]
Every clip contributes 192 frames (8 s at 24 fps); clips are crossfaded over 12 frames.
Narration ids refer to narration.json; each is placed 0.5 s after its scene starts.
Audio of source clips is ignored; BGM is mixed at low level.
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
CLIP_FRAMES, STEP, XFADE = 192, 180, 12
HEAD_SILENCE = 0.5
spec = importlib.util.spec_from_file_location("audio_helpers", HERE.parent / "audit_knowledge/build.py")
helpers = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helpers)


def clip_frames(path):
    last = None
    with av.open(str(path)) as container:
        n = 0
        for frame in container.decode(video=0):
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
            img = av.VideoFrame.from_ndarray(np.ascontiguousarray(out), format="rgb24")
            last = img.reformat(width=W, height=H, format="rgb24", interpolation="LANCZOS").to_ndarray(format="rgb24").astype(np.float32)
            yield last
            n += 1
            if n == CLIP_FRAMES:
                return
    while n < CLIP_FRAMES and last is not None:  # hold the last frame if a clip is short
        yield last
        n += 1


def audio_mix(cuts, seconds):
    length = int(seconds * RATE)
    music = helpers.read_audio(ROOT / "end-card/public/accounting-future-v3/bgm.wav")
    music = np.tile(music, (1, int(np.ceil(length / music.shape[1]))))[:, :length]
    music *= 10 ** (-34 / 20) / max(float(np.sqrt(np.mean(music ** 2))), 1e-9)
    music[:, :RATE] *= np.linspace(0, 1, RATE)
    music[:, -3 * RATE:] *= np.linspace(1, 0, 3 * RATE)
    plan = {item["id"]: item for item in json.loads((HERE / "narration.json").read_text(encoding="utf-8"))}
    placements = []
    for index, cut in enumerate(cuts):
        offset = index * STEP / FPS + HEAD_SILENCE
        for nid in cut.get("nar", []):
            placements.append((nid, offset))
            voice = helpers.read_audio(HERE / "audio" / f"nar{nid}.wav")
            offset += voice.shape[1] / RATE + 0.6
    voices = {nid: helpers.read_audio(HERE / "audio" / f"nar{nid}.wav") for nid, _ in placements}
    joined = np.concatenate(list(voices.values()), axis=1)
    gain = min(10 ** (-19 / 20) / max(float(np.sqrt(np.mean(joined ** 2))), 1e-9), .85 / max(float(np.max(np.abs(joined))), 1e-9))
    records = []
    for nid, start_s in placements:
        voice = voices[nid] * gain
        edge = int(.01 * RATE)
        voice[:, :edge] *= np.linspace(0, 1, edge)
        voice[:, -edge:] *= np.linspace(1, 0, edge)
        start = round(start_s * RATE)
        end = min(start + voice.shape[1], length)
        music[:, start:end] += voice[:, :end - start]
        records.append({"id": nid, "text": plan[nid]["text"], "start": round(start_s, 3), "end": round(end / RATE, 3)})
    peak = float(np.max(np.abs(music)))
    if peak > .94:
        music *= .94 / peak
    return np.ascontiguousarray(music, dtype=np.float32), records


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cut", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    cuts = json.loads(Path(args.cut).read_text(encoding="utf-8"))
    output = ROOT / args.out if not Path(args.out).is_absolute() else Path(args.out)
    if output.exists():
        raise FileExistsError(f"Keep the existing render; choose a new --out: {output}")
    paths = [ROOT / cut["clip"] for cut in cuts]
    for path in paths:
        if not path.exists():
            raise FileNotFoundError(path)
    scenes = len(cuts)
    total = (scenes - 1) * STEP + CLIP_FRAMES
    audio, placements = audio_mix(cuts, total / FPS)
    generators = [clip_frames(path) for path in paths]
    starts = [i * STEP for i in range(scenes)]
    with av.open(str(output), "w", options={"movflags": "+faststart"}) as container:
        container.metadata["comment"] = "AI-assisted fictional audit concept film. All companies, figures and documents are fictional."
        video = container.add_stream("libx264", rate=FPS, options={"crf": "18", "preset": "medium"})
        video.width, video.height, video.pix_fmt = W, H, "yuv420p"
        video.codec_context.thread_count = 4
        sound = container.add_stream("aac", rate=RATE)
        sound.layout, sound.bit_rate = "stereo", 192000
        audio_position = 0
        for index in range(total):
            active = [i for i in range(scenes) if starts[i] <= index < starts[i] + CLIP_FRAMES]
            frames = [next(generators[i]) for i in active]
            if len(frames) == 2:
                alpha = (index - starts[active[1]] + 1) / XFADE
                rgb = frames[0] * (1 - alpha) + frames[1] * alpha
            else:
                rgb = frames[0]
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
    report = {"output": str(output), "frames": total, "seconds": total / FPS, "cuts": cuts, "narration": placements,
              "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}
    (output.with_suffix(".manifest.json")).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"output": str(output), "seconds": total / FPS}), flush=True)


if __name__ == "__main__":
    main()
