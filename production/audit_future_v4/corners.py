"""Refine screen corners: threshold the dark panel inside a rough quad, fit a line to each side, intersect.
  python corners.py <image> TLx,TLy,...,BLx,BLy [--size 1920x1080 crop first]
Prints the refined quad (1080p coordinates) and writes <image>_fit.png."""
import sys
import cv2
import numpy as np

def load_1080(path):
    im = cv2.imread(path)
    h, w = im.shape[:2]
    cw = h * 16 // 9
    if cw <= w:
        left = (w - cw) // 2; im = im[:, left:left + cw]
    else:
        ch = w * 9 // 16; top = (h - ch) // 2; im = im[top:top + ch]
    return cv2.resize(im, (1920, 1080), interpolation=cv2.INTER_AREA)

def refine(im, quad, thr=(110, 90, 80), grow=28):
    b, g, r = [im[..., i].astype(int) for i in range(3)]
    dark = ((b < thr[0]) & (g < thr[1]) & (r < thr[2]) & (b >= r + 6)).astype(np.uint8) * 255
    roi = np.zeros(dark.shape, np.uint8)
    cv2.fillConvexPoly(roi, quad.astype(np.int32), 255)
    roi = cv2.dilate(roi, np.ones((grow * 2 + 1, grow * 2 + 1), np.uint8))
    m = cv2.bitwise_and(dark, roi)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    n, labels, stats, _ = cv2.connectedComponentsWithStats(m)
    k = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    comp = (labels == k).astype(np.uint8) * 255
    cnts, _ = cv2.findContours(comp, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    pts = max(cnts, key=cv2.contourArea).reshape(-1, 2).astype(np.float64)
    lines = []
    for i in range(4):
        a, bq = quad[i], quad[(i + 1) % 4]
        d = bq - a; L = np.linalg.norm(d); d /= L
        rel = pts - a
        along = rel @ d
        dist = np.abs(rel[:, 0] * d[1] - rel[:, 1] * d[0])
        sel = pts[(along > 0.12 * L) & (along < 0.88 * L) & (dist < 14)]
        vx, vy, x0, y0 = cv2.fitLine(sel.astype(np.float32), cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
        lines.append((np.array([x0, y0]), np.array([vx, vy]), len(sel)))
    out = []
    for i in range(4):
        p1, d1, _ = lines[(i - 1) % 4]; p2, d2, _ = lines[i]
        A = np.array([d1, -d2]).T
        t = np.linalg.solve(A, p2 - p1)
        out.append(p1 + d1 * t[0])
    return np.array(out), [l[2] for l in lines]

if __name__ == "__main__":
    path = sys.argv[1]
    quad = np.array([float(v) for v in sys.argv[2].split(",")]).reshape(4, 2)
    im = load_1080(path)
    q, counts = refine(im, quad)
    print(",".join(str(int(round(v))) for v in q.ravel()), "support", counts)
    vis = im.copy()
    cv2.polylines(vis, [q.astype(np.int32).reshape(-1, 1, 2)], True, (0, 255, 255), 1)
    for p in q:
        cv2.circle(vis, (int(p[0]), int(p[1])), 6, (0, 0, 255), 1)
    cv2.imwrite(path.replace(".png", "_fit.png"), vis)
