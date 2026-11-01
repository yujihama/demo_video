import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {c, font} from "./ui";
import {clamp} from "./anim";
import * as D from "./data";

// Opening 3 seconds: twenty points of light appear over darkness and settle into a 5 x 4 map of the group;
// each point becomes a company's score. No chart, just the companies.
const seeded = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const W = 1920, H = 1080;
  const cw = 220, ch = 118, x0 = (W - cw * 5) / 2, y0 = 300;
  return (
    <AbsoluteFill style={{background: "#070b14", fontFamily: font}}>
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, #10203a 0%, #070b14 60%)"}} />
      {D.GROUP.map((k, i) => {
        const appear = interpolate(f, [i * 1.2, i * 1.2 + 10], [0, 1], clamp);
        const settle = interpolate(f, [26 + i * 0.6, 54 + i * 0.6], [0, 1], clamp);
        const e = 1 - Math.pow(1 - settle, 3);
        const sx = seeded(i) * W * 0.8 + W * 0.1, sy = seeded(i + 99) * H * 0.6 + H * 0.15;
        const tx = x0 + k.col * cw + cw / 2, ty = y0 + k.row * ch + ch / 2;
        const x = sx + (tx - sx) * e, y = sy + (ty - sy) * e;
        const hot = !!k.hit;
        const lit = settle > 0.9;
        const col = hot && lit ? c.high : c.aiLine;
        const label = interpolate(f, [52 + i * 0.6, 62 + i * 0.6], [0, 1], clamp);
        return (
          <div key={k.name}>
            <div style={{position: "absolute", left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: 7, opacity: appear * (1 - label),
              background: col, boxShadow: `0 0 ${10 + 10 * (1 - e)}px ${col}`}} />
            <div style={{position: "absolute", left: tx - cw / 2 + 10, top: ty - ch / 2 + 8, width: cw - 20, height: ch - 16, borderRadius: 8, opacity: label,
              border: `1px solid ${hot ? c.high : c.aiLine}${hot ? "cc" : "44"}`, background: hot ? `${c.high}1f` : `${c.aiLine}0d`, color: "#dfe7f3", padding: "10px 12px", boxSizing: "border-box"}}>
              <div style={{fontSize: 14, color: hot ? "#ffd9b0" : `${c.aiMuted}`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{k.name}</div>
              <div style={{fontSize: 34, fontWeight: 800, marginTop: 4, color: hot ? c.high : "#dfe7f3", fontVariantNumeric: "tabular-nums"}}>{k.score}</div>
            </div>
          </div>
        );
      })}
      <div style={{position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", color: "#dfe7f3", fontSize: 30, letterSpacing: 6, opacity: interpolate(f, [56, 68], [0, 1], clamp)}}>
        連結子会社 20社　不正リスクスコア
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: y0 + ch * 4 + 40, textAlign: "center", color: c.aiMuted, fontSize: 19, letterSpacing: 2, opacity: interpolate(f, [60, 72], [0, 1], clamp)}}>
        過去の不正事例を学習した機械学習モデルが、毎朝、全社のスコアを算出
      </div>
    </AbsoluteFill>
  );
};
