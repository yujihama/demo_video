"""Composite a Remotion UI clip onto the monitor of an H3 person shot (perspective warp).

  python composite.py --person <h3 clip> --ui <remotion clip> --out <mp4> \
      --start TLx,TLy,TRx,TRy,BRx,BRy,BLx,BLy --end TLx,...  [--frames 192] [--opacity 0.94]

Corners are given in 1920x1080 frame coordinates (after the 16:9 center crop + upscale) for the
first and last frame; they are linearly interpolated in between (good enough for slow camera moves).
The UI is slightly darkened and blended with the original screen glow so it reads as a display.
"""
import argparse
import sys
from fractions import Fraction
from pathlib import Path

import av
import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from build import clip_frames  # noqa: E402  (1080p frames as float32)

W, H, FPS = 1920, 1080, 24


def parse(s):
    v = [float(x) for x in s.split(",")]
    return np.array(v, dtype=np.float32).reshape(4, 2)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--person", required=True)
    p.add_argument("--ui", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--start", required=True)
    p.add_argument("--end", required=True)
    p.add_argument("--frames", type=int, default=192)
    p.add_argument("--opacity", type=float, default=0.94)
    p.add_argument("--darken", type=float, default=0.88, help="multiply UI brightness so it sits in the scene")
    p.add_argument("--feather", type=int, default=6)
    p.add_argument("--bleed", type=float, default=0.0, help="how much of the original screen shows through the UI")
    p.add_argument("--key", type=float, default=0.0, help="if >0, keep foreground objects that occlude the blank screen: pixels whose color differs from the screen color by more than this are left untouched")
    a = p.parse_args()
    ref = None
    q0, q1 = parse(a.start), parse(a.end)
    src = np.array([[0, 0], [W, 0], [W, H], [0, H]], dtype=np.float32)
    person = clip_frames(a.person)
    ui = clip_frames(a.ui)
    with av.open(a.out, "w", options={"movflags": "+faststart"}) as container:
        stream = container.add_stream("libx264", rate=FPS, options={"crf": "17", "preset": "medium"})
        stream.width, stream.height, stream.pix_fmt = W, H, "yuv420p"
        for i in range(a.frames):
            bg = next(person)
            fg = next(ui) * a.darken
            t = i / max(1, a.frames - 1)
            quad = q0 * (1 - t) + q1 * t
            M = cv2.getPerspectiveTransform(src, quad)
            warped = cv2.warpPerspective(fg, M, (W, H), flags=cv2.INTER_AREA, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
            mask = cv2.warpPerspective(np.full((H, W), 255, np.uint8), M, (W, H), flags=cv2.INTER_LINEAR)
            mask = cv2.erode(mask, np.ones((3, 3), np.uint8))
            mask = cv2.GaussianBlur(mask, (a.feather * 2 + 1, a.feather * 2 + 1), 0).astype(np.float32) / 255.0 * a.opacity
            if a.key > 0:
                if ref is None:
                    inner = cv2.erode(cv2.warpPerspective(np.full((H, W), 255, np.uint8), M, (W, H)), np.ones((25, 25), np.uint8)) > 0
                    ref = np.median(bg[inner], axis=0)
                diff = np.linalg.norm(bg - ref, axis=2)
                # The blank screen is bluish (b >> r); dark hair and suits are neutral, so require the same chroma sign.
                chroma = (bg[..., 2] - bg[..., 0])
                ref_chroma = float(ref[2] - ref[0])
                screen = ((diff < a.key) & (chroma > 0.55 * ref_chroma)).astype(np.uint8) * 255
                screen = cv2.morphologyEx(screen, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
                screen = cv2.morphologyEx(screen, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
                # Fill small holes inside the screen (reflections) but keep large occluders.
                holes = cv2.bitwise_not(screen)
                n, labels, stats, _ = cv2.connectedComponentsWithStats(holes, connectivity=8)
                for k in range(1, n):
                    if stats[k, cv2.CC_STAT_AREA] < 1500:
                        screen[labels == k] = 255
                screen = cv2.erode(screen, np.ones((3, 3), np.uint8))
                screen = cv2.GaussianBlur(screen, (9, 9), 0).astype(np.float32) / 255.0
                mask = mask * screen
            # Keep a little of the original screen (reflections/glow) under the UI.
            out = bg * (1 - mask[..., None]) + (warped * (1 - a.bleed) + bg * a.bleed) * mask[..., None]
            frame = av.VideoFrame.from_ndarray(np.rint(np.clip(out, 0, 255)).astype(np.uint8), format="rgb24").reformat(format="yuv420p")
            frame.pts, frame.time_base = i, Fraction(1, FPS)
            for packet in stream.encode(frame):
                container.mux(packet)
        for packet in stream.encode():
            container.mux(packet)
    print("wrote", a.out)


if __name__ == "__main__":
    main()
