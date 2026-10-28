import type {CSSProperties} from "react";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {c} from "./ui";

export const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const ease = Easing.out(Easing.cubic);

/** Fade + slight rise. start/dur in frames. */
export const useReveal = (start: number, dur = 12): CSSProperties => {
  const f = useCurrentFrame();
  const t = interpolate(f, [start, start + dur], [0, 1], {...clamp, easing: ease});
  return {opacity: t, transform: `translateY(${(1 - t) * 10}px)`};
};

export const useT = (start: number, dur: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + dur], [0, 1], {...clamp, easing: ease});
};

export const useVisible = (start: number) => useCurrentFrame() >= start;

/** Typewriter: characters revealed from `start` at `cps` chars per second (24 fps). */
export const useTyped = (text: string, start: number, cps = 14) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.floor(((f - start) / 24) * cps));
  return text.slice(0, Math.min(text.length, n));
};

export type Key = {f: number; x: number; y: number; click?: boolean};

/** Animated cursor following keyframes; a click ring appears at keyframes flagged click. */
export const AnimCursor: React.FC<{keys: Key[]; show?: [number, number]}> = ({keys, show}) => {
  const f = useCurrentFrame();
  const xs = keys.map((k) => k.x), ys = keys.map((k) => k.y), fs = keys.map((k) => k.f);
  const x = interpolate(f, fs, xs, {...clamp, easing: ease});
  const y = interpolate(f, fs, ys, {...clamp, easing: ease});
  const click = keys.find((k) => k.click && f >= k.f && f < k.f + 14);
  const ring = click ? interpolate(f, [click.f, click.f + 14], [0, 1], clamp) : 0;
  const visible = show ? f >= show[0] && f <= show[1] : true;
  if (!visible) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, zIndex: 50, pointerEvents: "none"}}>
      {click ? <div style={{position: "absolute", left: -6 - ring * 22, top: -6 - ring * 22, width: 12 + ring * 44, height: 12 + ring * 44, borderRadius: "50%",
        border: `2px solid ${c.teal}`, opacity: 1 - ring}} /> : null}
      <svg width="26" height="30" viewBox="0 0 26 30"><path d="M2 2 L2 24 L8 18 L13 28 L17 26 L12 16 L20 16 Z" fill="#111" stroke="white" strokeWidth="1.5" /></svg>
    </div>
  );
};

/** Horizontal bar whose width grows in. */
export const GrowBar: React.FC<{pct: number; color: string; start: number; height?: number}> = ({pct, color, start, height = 18}) => {
  const t = useT(start, 18);
  return (
    <div style={{height, background: "#eef1f5", borderRadius: height / 2, overflow: "hidden"}}>
      <div style={{width: `${pct * t}%`, height: "100%", background: color, borderRadius: height / 2}} />
    </div>
  );
};

export const Toast: React.FC<{start: number; children: React.ReactNode}> = ({start, children}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [start, start + 10], [0, 1], {...clamp, easing: ease});
  if (f < start) return null;
  return (
    <div style={{position: "absolute", right: 40, bottom: 40, zIndex: 60, background: c.navy, color: "white", padding: "14px 20px", borderRadius: 10,
      fontSize: 19, opacity: t, transform: `translateY(${(1 - t) * 16}px)`, boxShadow: "0 10px 30px #0004"}}>{children}</div>
  );
};

/* ---------- v4 additions ---------- */

export type BreathState = "listen" | "think" | "answer" | "done" | "off";

/**
 * The thin line that stands for the AI: it ripples while listening, breathes slowly while thinking,
 * holds steady while answering and settles when done. `phases` lists [startFrame, state] in order.
 */
export const BreathLine: React.FC<{phases: [number, BreathState][]; style?: CSSProperties; width?: number | string}> = ({phases, style, width = "100%"}) => {
  const f = useCurrentFrame();
  let state: BreathState = "off", since = 0;
  for (const [at, s] of phases) if (f >= at) { state = s; since = at; }
  const t = (f - since) / 24;
  const N = 96;
  let opacity = 0, amp = 0, speed = 0, widthScale = 1;
  if (state === "listen") { opacity = 0.9; amp = 1; speed = 1; }
  if (state === "think") { opacity = 0.35 + 0.5 * (0.5 + 0.5 * Math.sin((t / 2.4) * Math.PI * 2 - Math.PI / 2)); widthScale = 0.92 + 0.08 * (0.5 + 0.5 * Math.sin((t / 2.4) * Math.PI * 2 - Math.PI / 2)); }
  if (state === "answer") { opacity = 0.85; }
  if (state === "done") { opacity = Math.max(0.3, 0.85 - t * 1.4); }
  if (state === "off") return null;
  // listening: a fake voice envelope, syllable-like bursts
  const env = (x: number) => 0.25 + 0.75 * Math.max(0, Math.sin(t * 7.3 + x * 0.9)) * (0.6 + 0.4 * Math.sin(t * 2.1 + 1.3));
  const pts = Array.from({length: N + 1}, (_, i) => {
    const x = i / N;
    const win = Math.sin(x * Math.PI);
    const y = state === "listen" ? Math.sin(x * 26 + t * 18 * speed) * 6 * amp * win * env(x * 10) : 0;
    return `${(x * 1000).toFixed(1)},${(12 + y).toFixed(2)}`;
  }).join(" ");
  return (
    <div style={{width, height: 24, position: "relative", ...style}}>
      <svg viewBox="0 0 1000 24" preserveAspectRatio="none" style={{position: "absolute", inset: 0, width: "100%", height: "100%", opacity}}>
        <defs>
          <linearGradient id="bl" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0"><stop offset="0" stopColor={c.aiLine} stopOpacity="0" /><stop offset="0.12" stopColor={c.aiLine} /><stop offset="0.88" stopColor={c.aiLine} /><stop offset="1" stopColor={c.aiLine} stopOpacity="0" /></linearGradient>
        </defs>
        <polyline points={pts} fill="none" stroke="url(#bl)" strokeWidth={state === "listen" ? 2.4 : 2} vectorEffect="non-scaling-stroke"
          style={{transform: `scaleX(${widthScale})`, transformOrigin: "50% 50%", filter: `drop-shadow(0 0 6px ${c.aiGlow})`}} />
      </svg>
    </div>
  );
};

/** Touch feedback: a soft ring that blooms where a finger lands. No cursor is drawn (the hand is in the live plate). */
export const TouchRing: React.FC<{at: number; x: number; y: number; hold?: number}> = ({at, x, y, hold = 0}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 18 + hold) return null;
  const t = f < at + hold ? 0 : interpolate(f, [at + hold, at + hold + 18], [0, 1], clamp);
  const r = 18 + t * 30;
  return (
    <div style={{position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", zIndex: 50, pointerEvents: "none",
      border: `2px solid ${c.aiLine}`, background: `${c.aiLine}${hold && f < at + hold ? "33" : "11"}`, opacity: 1 - t}} />
  );
};

/** Live transcript: words appear in chunks (speech-to-text cadence), the tail word faint until confirmed. */
export const useTranscript = (text: string, start: number, cps = 9) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.floor(((f - start) / 24) * cps));
  const shown = text.slice(0, Math.min(text.length, n));
  const done = n >= text.length;
  return {shown, done, live: f >= start && !done};
};
