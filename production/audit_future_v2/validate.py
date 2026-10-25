"""Technical QC for an audit_future_v2 render: full decode, frame count, audio, black frames, check stills."""
import argparse
import json
from pathlib import Path

import av
import numpy as np

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
STEP, SCENES, CLIP = 180, 8, 192
TOTAL = (SCENES - 1) * STEP + CLIP


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--res", choices=["low", "high"], default="high")
    parser.add_argument("--path")
    args = parser.parse_args()
    path = Path(args.path) if args.path else ROOT / "end-card/demo" / f"audit_future_v2_{args.res}.mp4"
    qc = HERE / "final_qc" / args.res
    qc.mkdir(parents=True, exist_ok=True)
    wanted = {0, 96, TOTAL - 30}
    for i in range(1, SCENES):
        wanted.update({i * STEP - 6, i * STEP + 6, i * STEP + 96})
    black_mid, count, width, height = [], 0, 0, 0
    with av.open(str(path)) as container:
        stream = container.streams.video[0]
        width, height, fps = stream.width, stream.height, float(stream.average_rate)
        for count, frame in enumerate(container.decode(video=0), 1):
            index = count - 1
            if index in wanted:
                frame.to_image().save(qc / f"frame{index:04}.png")
            if 15 <= index < TOTAL - 20 and index % 6 == 0:
                if float(frame.to_ndarray(format="gray").mean()) < 3:
                    black_mid.append(index)
    audio_seconds, peak = 0.0, 0.0
    with av.open(str(path)) as a:
        for af in a.decode(audio=0):
            audio_seconds += af.samples / af.sample_rate
            peak = max(peak, float(np.max(np.abs(af.to_ndarray()))))
    report = {"path": str(path), "frames": count, "expected_frames": TOTAL, "width": width, "height": height,
              "fps": fps, "video_seconds": round(count / fps, 3), "audio_seconds": round(audio_seconds, 3),
              "audio_peak": round(peak, 3), "black_frames_mid": black_mid,
              "ok": count == TOTAL and (width, height) == (1920, 1080) and not black_mid and peak < 0.99}
    (qc / "validation.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
