import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {c, font} from "./ui";
import {clamp} from "./anim";
import * as D from "./data";

// Opening 3 seconds: twenty points of light appear over darkness and settle into the histogram bins.
const seeded = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const BINS = D.HISTOGRAM.map((h) => h.n);
const POINTS: {bin: number; slot: number}[] = [];
BINS.forEach((n, b) => { for (let k = 0; k < n; k++) POINTS.push({bin: b, slot: k}); });

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const W = 1920, H = 1080;
  const x0 = 360, bw = 120, base = 760;
  return (
    <AbsoluteFill style={{background: "#070b14", fontFamily: font}}>
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 70%, #10203a 0%, #070b14 60%)"}} />
      {POINTS.map((p, i) => {
        const appear = interpolate(f, [i * 1.2, i * 1.2 + 10], [0, 1], clamp);
        const settle = interpolate(f, [26 + i * 0.6, 54 + i * 0.6], [0, 1], {...clamp});
        const e = 1 - Math.pow(1 - settle, 3);
        const sx = seeded(i) * W * 0.8 + W * 0.1, sy = seeded(i + 99) * H * 0.6 + H * 0.15;
        const tx = x0 + p.bin * bw + bw / 2, ty = base - p.slot * 46 - 23;
        const x = sx + (tx - sx) * e, y = sy + (ty - sy) * e;
        const hot = p.bin === 8;
        return <div key={i} style={{position: "absolute", left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: 7, opacity: appear,
          background: hot && settle > 0.9 ? c.high : c.aiLine, boxShadow: `0 0 ${10 + 10 * (1 - e)}px ${hot && settle > 0.9 ? c.high : c.aiLine}`}} />;
      })}
      {f >= 50 ? <div style={{position: "absolute", left: x0, top: base + 14, width: bw * 10, borderTop: `1px solid ${c.aiLine}55`, opacity: interpolate(f, [50, 62], [0, 1], clamp)}}>
        {D.HISTOGRAM.map((h, b) => <span key={h.bin} style={{position: "absolute", left: b * bw, width: bw, textAlign: "center", top: 10, fontSize: 15, color: `${c.aiMuted}cc`}}>{h.bin}</span>)}
      </div> : null}
      <div style={{position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", color: "#dfe7f3", fontSize: 30, letterSpacing: 6, opacity: interpolate(f, [56, 68], [0, 1], clamp)}}>
        連結子会社 20社　リスクスコア
      </div>
    </AbsoluteFill>
  );
};
