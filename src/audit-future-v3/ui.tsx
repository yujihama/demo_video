import type {CSSProperties, ReactNode} from "react";
import {AbsoluteFill} from "remotion";

// Realistic enterprise-app look: light background, navy text, teal as the product accent,
// amber for the single item that needs attention. All labels in Japanese.
export const c = {
  bg: "#f3f5f8", panel: "#ffffff", line: "#dde3ea", navy: "#1e2a44", text: "#243044", muted: "#6b7889",
  teal: "#176f7f", tealSoft: "#e3f1f3", amber: "#c0731d", amberSoft: "#fff2df", high: "#d9822b", mid: "#e6b35a",
  low: "#8fb8c4", sidebar: "#1b2740", sidebarText: "#c9d3e3", green: "#2f8f5b", greenSoft: "#e6f4ea",
};
export const font = '"Yu Gothic UI", "Meiryo", "Segoe UI", sans-serif';

export const panel: CSSProperties = {background: c.panel, border: `1px solid ${c.line}`, borderRadius: 12};

const NAV = ["ダッシュボード", "子会社一覧", "スコア分析", "資料・データ", "論点管理", "調書", "報告書"];

export const AppShell: React.FC<{active: number; crumbs: string[]; children: ReactNode}> = ({active, crumbs, children}) => (
  <AbsoluteFill style={{background: c.bg, fontFamily: font, color: c.text}}>
    <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 232, background: c.sidebar, color: c.sidebarText, padding: "26px 0"}}>
      <div style={{padding: "0 24px 26px", borderBottom: "1px solid #2b3a5c"}}>
        <div style={{fontSize: 15, letterSpacing: 2, color: "#8fa3c4"}}>グループ監査</div>
        <div style={{fontSize: 22, fontWeight: 700, color: "white", marginTop: 4}}>不正リスク分析</div>
      </div>
      <div style={{padding: "18px 0"}}>
        {NAV.map((n, i) => (
          <div key={n} style={{padding: "12px 24px", fontSize: 19, display: "flex", gap: 12, alignItems: "center",
            background: i === active ? "#2a3a5e" : "transparent", color: i === active ? "white" : c.sidebarText,
            borderLeft: i === active ? `4px solid ${c.teal}` : "4px solid transparent"}}>
            <span style={{width: 10, height: 10, borderRadius: 3, background: i === active ? c.teal : "#4a5a7c"}} />{n}
          </div>
        ))}
      </div>
      <div style={{position: "absolute", bottom: 26, left: 24, right: 24, fontSize: 15, color: "#8fa3c4", lineHeight: 1.6}}>
        対象：ミナトホールディングス<br />2026年3月期 ／ 連結子会社 20社<br />モデル更新：10月25日 06:12
      </div>
    </div>
    <div style={{position: "absolute", left: 232, right: 0, top: 0, height: 64, background: c.panel, borderBottom: `1px solid ${c.line}`,
      display: "flex", alignItems: "center", padding: "0 36px", fontSize: 19, color: c.muted, gap: 10}}>
      {crumbs.map((s, i) => <span key={s} style={{color: i === crumbs.length - 1 ? c.text : c.muted, fontWeight: i === crumbs.length - 1 ? 700 : 400}}>{i > 0 ? "›  " : ""}{s}</span>)}
      <span style={{marginLeft: "auto", display: "flex", gap: 22, alignItems: "center"}}>
        <span>監査チーム：第3事業部</span>
        <span style={{width: 34, height: 34, borderRadius: 17, background: c.tealSoft, color: c.teal, display: "grid", placeItems: "center", fontWeight: 700}}>田</span>
      </span>
    </div>
    <div style={{position: "absolute", left: 232 + 36, right: 36, top: 64 + 28, bottom: 28}}>{children}</div>
  </AbsoluteFill>
);

export const H: React.FC<{children: ReactNode; sub?: string}> = ({children, sub}) => (
  <div style={{display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16}}>
    <div style={{fontSize: 30, fontWeight: 700, color: c.navy}}>{children}</div>
    {sub ? <div style={{fontSize: 18, color: c.muted}}>{sub}</div> : null}
  </div>
);

export const Pill: React.FC<{tone?: "high" | "mid" | "low" | "teal" | "neutral" | "green"; children: ReactNode}> = ({tone = "neutral", children}) => {
  const map = {high: [c.amberSoft, c.high], mid: ["#fff7e6", "#9a6b1c"], low: ["#eef4f6", "#4d6a75"], teal: [c.tealSoft, c.teal], neutral: ["#eef1f5", c.muted], green: [c.greenSoft, c.green]} as const;
  const [bg, fg] = map[tone];
  return <span style={{display: "inline-block", background: bg, color: fg, fontSize: 16, fontWeight: 700, padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap"}}>{children}</span>;
};

export const Score: React.FC<{v: number; size?: number}> = ({v, size = 26}) => (
  <span style={{fontSize: size, fontWeight: 800, color: v >= 75 ? c.high : v >= 50 ? "#9a6b1c" : c.navy, fontVariantNumeric: "tabular-nums"}}>{v}</span>
);

export const Button: React.FC<{primary?: boolean; children: ReactNode; style?: CSSProperties}> = ({primary, children, style}) => (
  <span style={{display: "inline-block", padding: "10px 18px", borderRadius: 8, fontSize: 18, fontWeight: 700,
    background: primary ? c.teal : "white", color: primary ? "white" : c.teal, border: `1px solid ${c.teal}`, ...style}}>{children}</span>
);

export const Cursor: React.FC<{x: number; y: number; click?: boolean}> = ({x, y, click}) => (
  <div style={{position: "absolute", left: x, top: y, zIndex: 50, pointerEvents: "none"}}>
    {click ? <div style={{position: "absolute", left: -14, top: -14, width: 34, height: 34, borderRadius: 17, border: `2px solid ${c.teal}`, opacity: 0.7}} /> : null}
    <svg width="26" height="30" viewBox="0 0 26 30"><path d="M2 2 L2 24 L8 18 L13 28 L17 26 L12 16 L20 16 Z" fill="#111" stroke="white" strokeWidth="1.5" /></svg>
  </div>
);

export const Row: React.FC<{children: ReactNode; style?: CSSProperties}> = ({children, style}) => (
  <div style={{display: "flex", alignItems: "center", gap: 14, ...style}}>{children}</div>
);

export const Kpi: React.FC<{label: string; value: string; note?: string; tone?: "high" | "neutral"}> = ({label, value, note, tone = "neutral"}) => (
  <div style={{...panel, padding: "16px 20px", flex: 1}}>
    <div style={{fontSize: 16, color: c.muted}}>{label}</div>
    <div style={{fontSize: 34, fontWeight: 800, color: tone === "high" ? c.high : c.navy, marginTop: 4}}>{value}</div>
    {note ? <div style={{fontSize: 15, color: c.muted, marginTop: 2}}>{note}</div> : null}
  </div>
);
