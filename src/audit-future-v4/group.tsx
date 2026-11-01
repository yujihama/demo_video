import type {ReactNode} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {Score, c, panel} from "./ui";
import {clamp} from "./anim";
import * as D from "./data";

/* グループ各社の不正リスクスコア：5列（地域・事業）× 4行のタイル。グラフは使わず、会社とスコアだけを並べる。 */
export const GRID = {tileW: 308, tileH: 106, gap: 14, rowGap: 12, head: 30};
export const GRID_W = GRID.tileW * 5 + GRID.gap * 4; // 1596
export const GRID_H = GRID.head + GRID.tileH * 4 + GRID.rowGap * 3; // 484
export const tileRect = (col: number, row: number) => ({
  left: col * (GRID.tileW + GRID.gap), top: GRID.head + row * (GRID.tileH + GRID.rowGap), width: GRID.tileW, height: GRID.tileH,
});

export const GroupGrid: React.FC<{
  scoreOf?: (k: D.Company) => number;
  deltaOf?: (k: D.Company) => number | null;
  ring?: string;            // company name to outline
  ringStrong?: boolean;     // stronger (selected) outline
  tagOf?: (k: D.Company) => ReactNode;
  revealFrom?: number;      // tiles fade in one after another from this frame (-1 = static)
}> = ({scoreOf, deltaOf, ring, ringStrong, tagOf, revealFrom = -1}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "relative", width: GRID_W, height: GRID_H}}>
      {D.COLUMNS.map((name, col) => (
        <div key={name} style={{position: "absolute", left: col * (GRID.tileW + GRID.gap), top: 0, width: GRID.tileW, fontSize: 15, color: c.muted, letterSpacing: 1, paddingLeft: 4}}>{name}</div>
      ))}
      {D.GROUP.map((k, i) => {
        const r = tileRect(k.col, k.row);
        const score = scoreOf ? scoreOf(k) : k.score;
        const delta = deltaOf ? deltaOf(k) : k.prev === 0 ? null : score - k.prev;
        const on = ring === k.name;
        const o = revealFrom < 0 ? 1 : interpolate(f, [revealFrom + i * 2, revealFrom + i * 2 + 10], [0, 1], clamp);
        return (
          <div key={k.name} style={{position: "absolute", ...r, ...panel, padding: "12px 14px", opacity: o, boxSizing: "border-box",
            background: on ? (ringStrong ? c.amberSoft : "#fbf4ea") : score >= 75 ? "#fff8ef" : c.panel,
            boxShadow: on ? `0 0 0 ${ringStrong ? 3 : 2}px ${c.high}, 0 10px 28px #0b1a2e14` : (panel.boxShadow as string)}}>
            <div style={{fontSize: 17, fontWeight: score >= 75 || on ? 700 : 600, color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: 190}}>{k.name}</div>
            <div style={{fontSize: 13, color: c.muted, marginTop: 2}}>{k.biz}</div>
            <div style={{position: "absolute", right: 14, top: 10}}><Score v={score} size={32} /></div>
            <div style={{position: "absolute", left: 14, bottom: 10, fontSize: 14, color: delta === null ? c.muted : delta >= 10 ? c.high : c.muted}}>
              {delta === null ? "新規連結" : `前月比 ${delta > 0 ? "+" : ""}${delta}`}
            </div>
            {tagOf ? <div style={{position: "absolute", right: 14, bottom: 10}}>{tagOf(k)}</div> : null}
          </div>
        );
      })}
    </div>
  );
};

/** Legend used above the grid. */
export const ScoreLegend: React.FC = () => (
  <span style={{display: "inline-flex", gap: 18, fontSize: 15, color: c.muted, alignItems: "center"}}>
    <span><b style={{color: c.high}}>■</b> 75以上：要確認</span>
    <span><b style={{color: "#9a6b1c"}}>■</b> 50〜74：注意</span>
    <span><b style={{color: c.navy}}>■</b> 50未満</span>
  </span>
);
