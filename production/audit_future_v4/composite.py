"""Composite Remotion UI clips onto the blank screens of an H3 person shot (perspective warp), v4.

  python composite.py --person <h3 clip> --out <mp4> [--frames 192]
      --ui <clip> --quad TLx,TLy,TRx,TRy,BRx,BRy,BLx,BLy [--quad-end ...] [--offset 0] [--key 48]
      [--ui2 <clip> --quad2 ... [--offset2 0] [--key2 48]]          second plane (flat tablet)
      [--fly 40,92,144 [--fly-dur 12]]                               cards flying from plane 2 to plane 1
      [--spill 0.10]                                                 soft screen light on the surroundings
      [--opacity 1.0] [--darken 0.86] [--feather 6]

Corners are 1920x1080 frame coordinates (after the 16:9 centre crop + upscale), TL,TR,BR,BL.
--offset skips that many frames of the UI clip (a 384-frame UI clip can span a person cut and a full-screen cut).
--key keeps foreground objects (hands, heads) that occlude the blank screen, per plane.
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
SRC = np.array([[0, 0], [W, 0], [W, H], [0, H]], dtype=np.float32)


def parse(s, expand=0.0):
    """Corners TL,TR,BR,BL; `expand` pushes every edge outward by that many pixels (into the bezel)."""
    q = np.array([float(x) for x in s.split(",")], dtype=np.float32).reshape(4, 2)
    if expand:
        out = []
        for i in range(4):
            p0, p1, p2 = q[(i - 1) % 4], q[i], q[(i + 1) % 4]
            # outward normals of the two edges meeting at this corner (quad is clockwise in image coords)
            def normal(a, b):
                d = b - a; d /= np.linalg.norm(d); return np.array([-d[1], d[0]], dtype=np.float32) * -1
            n1, n2 = normal(p0, p1), normal(p1, p2)
            out.append(p1 + (n1 + n2) * expand)
        q = np.array(out, dtype=np.float32)
    return q


class Plane:
    def __init__(self, ui, quad, quad_end, offset, key, frames, darken, opacity, feather, src_size=(W, H), min_occluder=6000, grow=4, expand=0.0, key_xmin=0):
        self.gen = clip_frames(ui, frames=frames, offset=offset)
        self.q0, self.q1 = parse(quad, expand), parse(quad_end, expand) if quad_end else parse(quad, expand)
        self.key, self.darken, self.opacity, self.feather = key, darken, opacity, feather
        self.ref = None
        self.min_occluder, self.grow, self.key_xmin = min_occluder, grow, key_xmin
        self.src = np.array([[0, 0], [src_size[0], 0], [src_size[0], src_size[1]], [0, src_size[1]]], dtype=np.float32)

    def quad(self, t):
        return self.q0 * (1 - t) + self.q1 * t

    def render(self, bg, t):
        fg = next(self.gen) * self.darken
        quad = self.quad(t)
        M = cv2.getPerspectiveTransform(self.src, quad)
        warped = cv2.warpPerspective(fg, M, (W, H), flags=cv2.INTER_AREA, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        full = cv2.warpPerspective(np.full(fg.shape[:2], 255, np.uint8), M, (W, H), flags=cv2.INTER_LINEAR)
        mask = cv2.erode(full, np.ones((3, 3), np.uint8))
        mask = cv2.GaussianBlur(mask, (self.feather * 2 + 1, self.feather * 2 + 1), 0).astype(np.float32) / 255.0 * self.opacity
        if self.key > 0:
            if self.ref is None:
                inner = cv2.erode(full, np.ones((25, 25), np.uint8)) > 0
                self.ref = np.median(bg[inner], axis=0)
            diff = np.linalg.norm(bg - self.ref, axis=2)
            chroma = bg[..., 2] - bg[..., 0]
            ref_chroma = float(self.ref[2] - self.ref[0])
            screen = ((diff < self.key) & (chroma > 0.55 * ref_chroma)).astype(np.uint8) * 255
            screen = cv2.morphologyEx(screen, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
            screen = cv2.morphologyEx(screen, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
            if self.key_xmin > 0:
                screen[:, :self.key_xmin] = 255  # no occluders expected left of this column
            # Only large non-screen regions are real occluders (hands, heads); small ones are reflections or noise.
            holes = cv2.bitwise_and(cv2.bitwise_not(screen), full)
            n, labels, stats, _ = cv2.connectedComponentsWithStats(holes, connectivity=8)
            for k in range(1, n):
                if stats[k, cv2.CC_STAT_AREA] < self.min_occluder:
                    screen[labels == k] = 255
            # Grow the screen a few pixels into the occluder so no dark fringe of the blank screen remains around hands.
            screen = cv2.dilate(screen, np.ones((2 * self.grow + 1, 2 * self.grow + 1), np.uint8))
            screen = cv2.GaussianBlur(screen, (7, 7), 0).astype(np.float32) / 255.0
            mask = mask * screen
        return warped, mask, full


def spill_light(bg, warped, full, amount):
    """Soft light from the screen onto the surroundings: a heavily blurred copy of the UI, outside the screen only."""
    small = cv2.resize(warped, (W // 8, H // 8), interpolation=cv2.INTER_AREA)
    glow = cv2.GaussianBlur(small, (0, 0), 14)
    glow = cv2.resize(glow, (W, H), interpolation=cv2.INTER_LINEAR)
    outside = 1.0 - cv2.GaussianBlur(full, (0, 0), 6).astype(np.float32) / 255.0
    # Light falls off with distance from the screen edge.
    dist = cv2.distanceTransform(cv2.bitwise_not(full), cv2.DIST_L2, 5)
    fall = np.clip(1.0 - dist / 220.0, 0, 1) ** 1.6
    w = (outside * fall * amount)[..., None]
    return bg + glow * w


def fly_card(frame, i, flights, dur, p_from, p_to, t):
    """A small card travelling from the top-centre of plane `p_from` (tablet) to the bottom-centre of plane `p_to` (display).
    Drawn as an opaque teal card with a short trail so it reads over both dark and light backgrounds."""
    for f0 in flights:
        if f0 <= i < f0 + dur:
            u = (i - f0 + 0.5) / dur
            e = u * u * (3 - 2 * u)  # smooth-step: visible travel over the whole duration
            a = p_from.quad(t)
            b = p_to.quad(t)
            start = (a[0] + a[1]) / 2
            end = (b[3] + b[2]) / 2
            layer = np.zeros(frame.shape[:2], np.float32)
            for k in range(5):  # short trail behind the card
                uu = max(0.0, e - k * 0.035)
                p = start + (end - start) * uu
                w, h = 150 * (1 - 0.45 * e), 44 * (1 - 0.45 * e)
                tmp = np.zeros(frame.shape[:2], np.uint8)
                cv2.rectangle(tmp, (int(p[0] - w / 2), int(p[1] - h / 2)), (int(p[0] + w / 2), int(p[1] + h / 2)), 255, thickness=-1, lineType=cv2.LINE_AA)
                layer = np.maximum(layer, tmp.astype(np.float32) / 255.0 * (1.0 - k * 0.2))
            layer = cv2.GaussianBlur(layer, (0, 0), 2.5)
            fade = min(1.0, (i - f0 + 1) / 3.0, (f0 + dur - i) / 3.0)
            alpha = (layer * 0.92 * fade)[..., None]
            color = np.array([63, 193, 201], dtype=np.float32)
            frame = frame * (1 - alpha) + (0.35 * frame + 0.65 * color) * alpha
            # a thin bright core so it reads on white too
            core = cv2.erode((layer > 0.5).astype(np.uint8), np.ones((9, 9), np.uint8)).astype(np.float32)[..., None] * fade
            frame = frame * (1 - core * 0.5) + np.array([24, 110, 118], dtype=np.float32) * core * 0.5
    return frame


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--person", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--frames", type=int, default=192)
    p.add_argument("--person-offset", type=int, default=0)
    p.add_argument("--ui", required=True)
    p.add_argument("--quad", required=True)
    p.add_argument("--quad-end")
    p.add_argument("--offset", type=int, default=0)
    p.add_argument("--key", type=float, default=0.0)
    p.add_argument("--ui2")
    p.add_argument("--quad2")
    p.add_argument("--quad2-end")
    p.add_argument("--offset2", type=int, default=0)
    p.add_argument("--key2", type=float, default=0.0)
    p.add_argument("--ui-size", default="1920,1080", help="pixel size of the first UI clip (1600,1200 for a tablet render)")
    p.add_argument("--ui2-size", default="1600,1200", help="pixel size of the second UI clip")
    p.add_argument("--fly", default="", help="comma separated frames at which a card flies from plane 2 to plane 1")
    p.add_argument("--fly-dur", type=int, default=12)
    p.add_argument("--spill", type=float, default=0.0)
    p.add_argument("--min-occluder", type=int, default=6000)
    p.add_argument("--grow", type=int, default=4)
    p.add_argument("--key-xmin", type=int, default=0, help="apply the occluder key only right of this x (plane 1)")
    p.add_argument("--expand", type=float, default=0.0, help="push the screen quad outward by this many pixels (hides the dark rim of the blank screen)")
    p.add_argument("--opacity", type=float, default=1.0)
    p.add_argument("--darken", type=float, default=0.86)
    p.add_argument("--feather", type=int, default=6)
    a = p.parse_args()

    person = clip_frames(a.person, frames=a.frames, offset=a.person_offset)
    w1, h1 = [int(x) for x in a.ui_size.split(",")]
    plane1 = Plane(a.ui, a.quad, a.quad_end, a.offset, a.key, a.frames, a.darken, a.opacity, a.feather, src_size=(w1, h1), min_occluder=a.min_occluder, grow=a.grow, expand=a.expand, key_xmin=a.key_xmin)
    plane2 = None
    if a.ui2:
        w2, h2 = [int(x) for x in a.ui2_size.split(",")]
        plane2 = Plane(a.ui2, a.quad2, a.quad2_end, a.offset2, a.key2, a.frames, a.darken, a.opacity, a.feather, src_size=(w2, h2), min_occluder=a.min_occluder, grow=a.grow, expand=a.expand)
    flights = [int(x) for x in a.fly.split(",") if x.strip()]
    with av.open(a.out, "w", options={"movflags": "+faststart"}) as container:
        stream = container.add_stream("libx264", rate=FPS, options={"crf": "17", "preset": "medium"})
        stream.width, stream.height, stream.pix_fmt = W, H, "yuv420p"
        for i in range(a.frames):
            bg = next(person)
            t = i / max(1, a.frames - 1)
            out = bg
            planes = [plane1] + ([plane2] if plane2 else [])
            for plane in planes:
                warped, mask, full = plane.render(bg, t)
                if a.spill > 0:
                    out = spill_light(out, warped, full, a.spill)
                out = out * (1 - mask[..., None]) + warped * mask[..., None]
            if plane2 and flights:
                out = fly_card(out, i, flights, a.fly_dur, plane2, plane1, t)
            frame = av.VideoFrame.from_ndarray(np.rint(np.clip(out, 0, 255)).astype(np.uint8), format="rgb24").reformat(format="yuv420p")
            frame.pts, frame.time_base = i, Fraction(1, FPS)
            for packet in stream.encode(frame):
                container.mux(packet)
        for packet in stream.encode():
            container.mux(packet)
    print("wrote", a.out)


if __name__ == "__main__":
    main()
