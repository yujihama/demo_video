"""Assemble audit_future_v2: 8 generated scenes, narration and BGM. No ending card.

  python_embeded\\python.exe production\\audit_future_v2\\build.py --res high

Timeline (24 fps): scene i (0-based) starts at frame 180*i, each scene 192 frames,
12-frame (0.5 s) crossfades. Total = 7*180 + 192 = 1452 frames = 60.5 s.
Generated clip audio is muted; narration and BGM are mixed here. Fade in 8 frames, fade out 18 frames.
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
SCENES, CLIP_FRAMES, STEP, XFADE = 8, 192, 180, 12
TOTAL = (SCENES - 1) * STEP + CLIP_FRAMES
HEAD_SILENCE = 0.5
spec = importlib.util.spec_from_file_location("audio_helpers", HERE.parent / "audit_knowledge/build.py")
helpers = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helpers)


def clip_frames(path):
    """Decode a clip and center-crop every frame to 16:9 (crops width for 864x480, height for 608x352)."""
    with av.open(str(path)) as container:
        for frame in container.decode(video=0):
            rgb = frame.to_ndarray(format="rgb24")
            height, width = rgb.shape[:2]
            if width * 9 >= height * 16:
                crop_w = height * 16 // 9
                left = (width - crop_w) // 2
                yield np.ascontiguousarray(rgb[:, left:left + crop_w])
            else:
                crop_h = width * 9 // 16
                top = (height - crop_h) // 2
                yield np.ascontiguousarray(rgb[top:top + crop_h])


def audio_mix(seconds):
    length = int(seconds * RATE)
    music = helpers.read_audio(ROOT / "end-card/public/accounting-future-v3/bgm.wav")
    music = np.tile(music, (1, int(np.ceil(length / music.shape[1]))))[:, :length]
    music *= 10 ** (-34 / 20) / max(float(np.sqrt(np.mean(music ** 2))), 1e-9)
    music[:, :RATE] *= np.linspace(0, 1, RATE)
    music[:, -3 * RATE:] *= np.linspace(1, 0, 3 * RATE)
    plan = [item for item in json.loads((HERE / "narration.json").read_text(encoding="utf-8")) if item["scene"] <= SCENES]
    voices = {item["id"]: helpers.read_audio(HERE / "audio" / f"nar{item['id']}.wav") for item in plan}
    # One gain for the whole narration keeps the natural dynamics between lines (single-take delivery).
    joined = np.concatenate(list(voices.values()), axis=1)
    gain = min(10 ** (-19 / 20) / max(float(np.sqrt(np.mean(joined ** 2))), 1e-9),
               .85 / max(float(np.max(np.abs(joined))), 1e-9))
    records = []
    for item in plan:
        voice = voices[item["id"]]
        duration = voice.shape[1] / RATE
        start_s = (item["scene"] - 1) * STEP / FPS + HEAD_SILENCE
        window = STEP / FPS - HEAD_SILENCE + 0.3  # may run 0.3 s into the crossfade
        if item["scene"] == SCENES:
            window = CLIP_FRAMES / FPS - HEAD_SILENCE - 0.8
        if duration > window + 0.03:
            raise ValueError(f"Narration {item['id']} ({duration:.2f}s) exceeds its window ({window:.2f}s).")
        voice = voice * gain
        edge = int(.01 * RATE)
        voice[:, :edge] *= np.linspace(0, 1, edge)
        voice[:, -edge:] *= np.linspace(1, 0, edge)
        start = round(start_s * RATE)
        end = start + voice.shape[1]
        music[:, start:end] += voice
        records.append({**item, "start": round(start_s, 3), "duration": round(duration, 3), "end": round(end / RATE, 3)})
    peak = float(np.max(np.abs(music)))
    if peak > .94:
        music *= .94 / peak
    return np.ascontiguousarray(music, dtype=np.float32), records


def to_hd(rgb):
    img = av.VideoFrame.from_ndarray(np.rint(np.clip(rgb, 0, 255)).astype(np.uint8), format="rgb24")
    return img.reformat(width=W, height=H, format="rgb24", interpolation="LANCZOS").to_ndarray(format="rgb24").astype(np.float32)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--res", choices=["low", "high"], default="high")
    parser.add_argument("--out")
    parser.add_argument("--scenes", type=int, default=8, help="assemble only the first N scenes (preview)")
    args = parser.parse_args()
    global SCENES, TOTAL
    SCENES = args.scenes
    TOTAL = (SCENES - 1) * STEP + CLIP_FRAMES
    default_name = f"audit_future_v2_{args.res}.mp4" if SCENES == 8 else f"audit_future_v2_{args.res}_preview{SCENES:02}.mp4"
    output = Path(args.out) if args.out else ROOT / "end-card/demo" / default_name
    if output.exists():
        raise FileExistsError(f"Keep the existing render; choose a new --out: {output}")
    clips = [HERE / "clips" / args.res / f"scene{i:02}.mp4" for i in range(1, SCENES + 1)]
    for path in clips:
        if not path.exists():
            raise FileNotFoundError(path)
    audio, placements = audio_mix(TOTAL / FPS)
    generators = [clip_frames(path) for path in clips]
    starts = [i * STEP for i in range(SCENES)]
    with av.open(str(output), "w", options={"movflags": "+faststart"}) as container:
        container.metadata["comment"] = ("AI-generated fictional audit concept film. Subsidiaries, scores and documents are "
                                         "fictional; interface imagery is illustrative. Narration is synthesized.")
        video = container.add_stream("libx264", rate=FPS, options={"crf": "18", "preset": "medium"})
        video.width, video.height, video.pix_fmt = W, H, "yuv420p"
        video.codec_context.thread_count = 4
        sound = container.add_stream("aac", rate=RATE)
        sound.layout, sound.bit_rate = "stereo", 192000
        audio_position = 0
        for index in range(TOTAL):
            active = [i for i in range(SCENES) if starts[i] <= index < starts[i] + CLIP_FRAMES]
            frames = [to_hd(next(generators[i])) for i in active]
            if len(frames) == 2:
                alpha = (index - starts[active[1]] + 1) / XFADE
                rgb = frames[0] * (1 - alpha) + frames[1] * alpha
            else:
                rgb = frames[0]
            fade = min(1., index / 8, (TOTAL - 1 - index) / 18)
            if fade < 1:
                rgb = rgb * fade
            frame = av.VideoFrame.from_ndarray(np.rint(rgb).astype(np.uint8), format="rgb24").reformat(format="yuv420p")
            frame.pts, frame.time_base = index, Fraction(1, FPS)
            for packet in video.encode(frame):
                container.mux(packet)
            desired = min(round((index + 1) * RATE / FPS), audio.shape[1])
            while audio_position + 1024 <= desired:
                af = av.AudioFrame.from_ndarray(np.ascontiguousarray(audio[:, audio_position:audio_position + 1024]),
                                                format="fltp", layout="stereo")
                af.sample_rate, af.pts, af.time_base = RATE, audio_position, Fraction(1, RATE)
                for packet in sound.encode(af):
                    container.mux(packet)
                audio_position += 1024
            if index % 240 == 0:
                print(f"Encoded {index}/{TOTAL}", flush=True)
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
    report = {"output": str(output), "res": args.res, "fps": FPS, "render_size": [W, H], "frames": TOTAL,
              "seconds": TOTAL / FPS, "scene_start_frames": starts, "crossfade_frames": XFADE,
              "narration": placements, "bgm": "end-card/public/accounting-future-v3/bgm.wav (looped, -34 dBFS RMS)",
              "source_model_audio": "muted", "ending_card": False, "logos": False, "company_name": False,
              "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}
    (HERE / f"build_manifest_{args.res}.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"output": str(output), "seconds": TOTAL / FPS}), flush=True)


if __name__ == "__main__":
    main()
