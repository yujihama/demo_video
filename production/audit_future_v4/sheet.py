import sys, glob
from PIL import Image
res, n = sys.argv[1], sys.argv[2]
fs = sorted(glob.glob(f'production/audit_future_v4/qc/{res}/scene{n}/*.png'))
ims = [Image.open(f) for f in fs]; w, h = ims[0].size
sheet = Image.new('RGB', (w*3, h*2))
for i, im in enumerate(ims[:6]): sheet.paste(im, ((i%3)*w, (i//3)*h))
out = f'production/audit_future_v4/qc/{res}/scene{n}_sheet.png'; sheet.save(out); print(out)
