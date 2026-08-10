from __future__ import annotations

import json
import sys
from pathlib import Path

import av


def seconds(value: int | None, time_base) -> float | None:
    if value is None:
        return None
    return round(float(value * time_base), 3)


def main() -> None:
    video_path = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)

    with av.open(str(video_path)) as container:
        video = container.streams.video[0]
        audio = container.streams.audio[0] if container.streams.audio else None
        report = {
            "path": str(video_path.resolve()),
            "size_bytes": video_path.stat().st_size,
            "container_duration_sec": round(container.duration / av.time_base, 3),
            "video": {
                "codec": video.codec_context.name,
                "width": video.codec_context.width,
                "height": video.codec_context.height,
                "fps": str(video.average_rate),
                "frames": video.frames,
                "duration_sec": seconds(video.duration, video.time_base),
            },
            "audio": None
            if audio is None
            else {
                "codec": audio.codec_context.name,
                "sample_rate": audio.codec_context.sample_rate,
                "channels": audio.codec_context.channels,
                "duration_sec": seconds(audio.duration, audio.time_base),
            },
        }

    targets = [0.5, 7.95, 8.05, 64.5, 136.5, 184.5, 248.5, 280.5, 303.0]
    extracted = []
    for target in targets:
        with av.open(str(video_path)) as container:
            stream = container.streams.video[0]
            container.seek(
                int(target / float(stream.time_base)),
                any_frame=False,
                backward=True,
                stream=stream,
            )
            chosen = None
            chosen_time = None
            for frame in container.decode(stream):
                if frame.pts is None:
                    continue
                frame_time = float(frame.pts * stream.time_base)
                chosen = frame
                chosen_time = frame_time
                if frame_time >= target:
                    break
            if chosen is None:
                raise RuntimeError(f"Could not decode frame near {target}s")
            output = output_dir / f"final-{target:06.2f}s.png"
            chosen.to_image().save(output)
            extracted.append({"target_sec": target, "actual_sec": round(chosen_time or 0, 3), "file": str(output)})

    report["extracted_frames"] = extracted
    rendered = json.dumps(report, ensure_ascii=False, indent=2)
    (output_dir / "report.json").write_text(rendered + "\n", encoding="utf-8")
    print(rendered)


if __name__ == "__main__":
    main()
