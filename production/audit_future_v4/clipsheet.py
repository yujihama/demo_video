"""Contact sheet of a clip: every `step` frames with frame numbers, to read gesture timing.
  python clipsheet.py <clip.mp4> <out.png> [step=8] [cols=6]"""
import sys
import av
import numpy as np
from PIL import Image, ImageDraw

path, out = sys.argv[1], sys.argv[2]
step = int(sys.argv[3]) if len(sys.argv) > 3 else 8
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 6
tiles = []
with av.open(path) as c:
    for i, fr in enumerate(c.decode(video=0)):
        if i % step == 0:
            im = fr.to_image().resize((480, 270))
            ImageDraw.Draw(im).rectangle([0, 0, 70, 26], fill=(0, 0, 0))
            ImageDraw.Draw(im).text((6, 6), f"f{i}", fill=(255, 255, 0))
            tiles.append(im)
rows = (len(tiles) + cols - 1) // cols
sheet = Image.new("RGB", (480 * cols, 270 * rows))
for k, t in enumerate(tiles):
    sheet.paste(t, ((k % cols) * 480, (k // cols) * 270))
sheet.save(out)
print(out, len(tiles))
