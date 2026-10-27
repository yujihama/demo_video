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
