import type {CSSProperties, ReactNode} from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {useReveal} from "./anim";

// v4 look: hybrid. Human work surfaces stay light and quiet (fewer borders, more whitespace);
// AI work surfaces are dark navy edged with one thin glowing line. All labels in Japanese.
export const c = {
  bg: "#f4f6f9", panel: "#ffffff", line: "#e3e8ee", navy: "#1e2a44", text: "#243044", muted: "#6b7889",
  teal: "#176f7f", tealSoft: "#e3f1f3", amber: "#c0731d", amberSoft: "#fff2df", high: "#d9822b", mid: "#e6b35a",
  low: "#9fbfc9", sidebar: "#141c30", sidebarText: "#b9c4d8", green: "#2f8f5b", greenSoft: "#e6f4ea",
  aiPanel: "#121b2e", aiPanelSoft: "#1a2540", aiText: "#dfe7f3", aiMuted: "#8fa3c4", aiLine: "#3fc1c9", aiGlow: "#3fc1c966",
};
export const font = '"Yu Gothic UI", "Meiryo", "Segoe UI", sans-serif';

export const panel: CSSProperties = {background: c.panel, borderRadius: 10, boxShadow: "0 1px 2px #0b1a2e0a, 0 10px 28px #0b1a2e08"};
export const aiPanel: CSSProperties = {background: c.aiPanel, color: c.aiText, borderRadius: 10, border: `1px solid ${c.aiLine}2e`, boxShadow: `inset 0 0 0 1px ${c.aiLine}12, 0 0 28px ${c.aiLine}12`};

const NAV = ["ダッシュボード", "子会社一覧", "スコア分析", "資料・データ", "論点管理", "調書", "報告書"];
const ICONS = [
  "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  "M4 6h16M4 12h16M4 18h10",
  "M4 20V10M10 20V4M16 20v-8M22 20H2",
  "M3 7h6l2 2h10v10H3z",
  "M5 4v16M5 4h12l-3 4 3 4H5",
  "M6 3h9l4 4v14H6zM9 12h6M9 16h6",
  "M4 4h16v16H4zM8 9h8M8 13h5",
];

const Icon: React.FC<{d: string; color: string}> = ({d, color}) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

/** Small always-on light: the AI keeps working whether or not someone is watching. */
export const StatusLight: React.FC<{label?: string}> = ({label = "AI 稼働中"}) => {
  const f = useCurrentFrame();
  const o = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin((f / 72) * Math.PI * 2));
  return (
    <span style={{display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, color: c.muted}}>
      <span style={{width: 8, height: 8, borderRadius: 4, background: c.aiLine, opacity: o, boxShadow: `0 0 ${6 + 6 * o}px ${c.aiLine}`}} />{label}
    </span>
  );
};

export const AppShell: React.FC<{active: number; crumbs: string[]; children: ReactNode; dim?: boolean}> = ({active, crumbs, children}) => (
  <AbsoluteFill style={{background: c.bg, fontFamily: font, color: c.text}}>
    <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 232, background: c.sidebar, color: c.sidebarText, padding: "26px 0"}}>
      <div style={{padding: "0 24px 24px"}}>
        <div style={{fontSize: 13, letterSpacing: 3, color: "#7f93b6"}}>GROUP AUDIT</div>
        <div style={{fontSize: 21, fontWeight: 700, color: "white", marginTop: 4, letterSpacing: 1}}>不正リスク分析</div>
      </div>
      <div style={{padding: "6px 0"}}>
        {NAV.map((n, i) => (
          <div key={n} style={{padding: "12px 24px", fontSize: 18, display: "flex", gap: 12, alignItems: "center",
            background: i === active ? "#22304f" : "transparent", color: i === active ? "white" : c.sidebarText,
            boxShadow: i === active ? `inset 3px 0 0 ${c.aiLine}` : "none"}}>
            <Icon d={ICONS[i]} color={i === active ? c.aiLine : "#6f82a6"} />{n}
          </div>
        ))}
      </div>
      <div style={{position: "absolute", bottom: 24, left: 24, right: 24, fontSize: 14, color: "#7f93b6", lineHeight: 1.7}}>
        対象：ミナトホールディングス<br />2030年3月期 ／ 連結子会社 20社<br />モデル更新 06:12 ／ 次回 明日 06:00
      </div>
    </div>
    <div style={{position: "absolute", left: 232, right: 0, top: 0, height: 64, background: c.panel, boxShadow: "0 1px 0 #0b1a2e0d",
      display: "flex", alignItems: "center", padding: "0 36px", fontSize: 18, color: c.muted, gap: 10}}>
      {crumbs.map((s, i) => <span key={s} style={{color: i === crumbs.length - 1 ? c.text : c.muted, fontWeight: i === crumbs.length - 1 ? 700 : 400}}>{i > 0 ? "›  " : ""}{s}</span>)}
      <span style={{marginLeft: "auto", display: "flex", gap: 26, alignItems: "center"}}>
        <StatusLight />
        <span style={{fontSize: 16}}>監査チーム：第3事業部</span>
        <span style={{width: 34, height: 34, borderRadius: 17, background: c.tealSoft, color: c.teal, display: "grid", placeItems: "center", fontWeight: 700}}>田</span>
      </span>
    </div>
    <div style={{position: "absolute", left: 232 + 36, right: 36, top: 64 + 28, bottom: 28}}>{children}</div>
  </AbsoluteFill>
);

export const H: React.FC<{children: ReactNode; sub?: string}> = ({children, sub}) => (
  <div style={{display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16}}>
    <div style={{fontSize: 30, fontWeight: 700, color: c.navy, letterSpacing: 0.5}}>{children}</div>
    {sub ? <div style={{fontSize: 17, color: c.muted}}>{sub}</div> : null}
  </div>
);

export const Pill: React.FC<{tone?: "high" | "mid" | "low" | "teal" | "neutral" | "green" | "ai"; children: ReactNode}> = ({tone = "neutral", children}) => {
  const map = {high: [c.amberSoft, c.high], mid: ["#fff7e6", "#9a6b1c"], low: ["#eef4f6", "#4d6a75"], teal: [c.tealSoft, c.teal], neutral: ["#eef1f5", c.muted], green: [c.greenSoft, c.green], ai: [`${c.aiLine}22`, c.aiLine]} as const;
  const [bg, fg] = map[tone];
  return <span style={{display: "inline-block", background: bg, color: fg, fontSize: 15, fontWeight: 700, padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap"}}>{children}</span>;
};

export const Score: React.FC<{v: number; size?: number}> = ({v, size = 26}) => (
  <span style={{fontSize: size, fontWeight: 800, color: v >= 75 ? c.high : v >= 50 ? "#9a6b1c" : c.navy, fontVariantNumeric: "tabular-nums"}}>{v}</span>
);

export const Button: React.FC<{primary?: boolean; children: ReactNode; style?: CSSProperties; pressed?: boolean}> = ({primary, children, style, pressed}) => (
  <span style={{display: "inline-block", padding: "12px 22px", borderRadius: 8, fontSize: 18, fontWeight: 700,
    background: primary ? c.teal : "white", color: primary ? "white" : c.teal, border: `1px solid ${c.teal}`,
    filter: pressed ? "brightness(0.85)" : "none", transform: pressed ? "scale(0.98)" : "none", ...style}}>{children}</span>
);

export const Row: React.FC<{children: ReactNode; style?: CSSProperties}> = ({children, style}) => (
  <div style={{display: "flex", alignItems: "center", gap: 14, ...style}}>{children}</div>
);

export const Kpi: React.FC<{label: string; value: string; note?: string; tone?: "high" | "neutral"}> = ({label, value, note, tone = "neutral"}) => (
  <div style={{...panel, padding: "16px 20px", flex: 1}}>
    <div style={{fontSize: 15, color: c.muted}}>{label}</div>
    <div style={{fontSize: 34, fontWeight: 800, color: tone === "high" ? c.high : c.navy, marginTop: 4, fontVariantNumeric: "tabular-nums"}}>{value}</div>
    {note ? <div style={{fontSize: 14, color: c.muted, marginTop: 2}}>{note}</div> : null}
  </div>
);

export const Panel: React.FC<{title?: string; right?: ReactNode; style?: CSSProperties; children: ReactNode; ai?: boolean}> = ({title, right, style, children, ai}) => (
  <div style={{...(ai ? aiPanel : panel), padding: "20px 24px", ...style}}>
    {title ? <Row style={{justifyContent: "space-between", marginBottom: 14}}><div style={{fontSize: 20, fontWeight: 700, color: ai ? c.aiText : c.navy}}>{title}</div>{right}</Row> : null}
    {children}
  </div>
);

export const Reveal: React.FC<{at: number; style?: CSSProperties; children: ReactNode}> = ({at, style, children}) => {
  const s = useReveal(at);
  return <div style={{...s, ...style}}>{children}</div>;
};

/** Team presence: small avatars with a live dot. */
export const Presence: React.FC<{names: string[]; live?: number}> = ({names, live = 0}) => (
  <span style={{display: "inline-flex", alignItems: "center"}}>
    {names.map((n, i) => (
      <span key={n} style={{width: 30, height: 30, borderRadius: 15, background: ["#e3f1f3", "#fff2df", "#e8e9f5"][i % 3], color: c.navy, fontSize: 14, fontWeight: 700,
        display: "grid", placeItems: "center", marginLeft: i ? -8 : 0, border: "2px solid white", position: "relative"}}>{n}
        {i < live ? <span style={{position: "absolute", right: -1, bottom: -1, width: 9, height: 9, borderRadius: 5, background: c.green, border: "2px solid white"}} /> : null}
      </span>
    ))}
  </span>
);
