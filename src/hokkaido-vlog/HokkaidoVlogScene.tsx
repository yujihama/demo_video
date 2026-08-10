import {Video} from "@remotion/media";
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from "remotion";
import {HOKKAIDO_VLOG_DURATION, SCENE_DURATION} from "./data";
import type {HokkaidoSceneConfig} from "./types";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const HokkaidoVlogScene: React.FC<{config: HokkaidoSceneConfig}> = ({config}) => {
  const frame = useCurrentFrame();
  const globalFrame = (config.index - 1) * SCENE_DURATION + frame;
  const titleInStart = config.index === 1 ? 72 : 9;
  const titleOpacity = interpolate(frame, [titleInStart, titleInStart + 18, 142, 176], [0, 1, 1, 0], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const titleY = interpolate(frame, [titleInStart, titleInStart + 21], [22, 0], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const overallFade = config.index === 1
    ? interpolate(frame, [0, 15], [0, 1], clamp)
    : config.index === 15
      ? interpolate(frame, [168, 191], [1, 0], clamp)
      : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#05090c",
        color: "white",
        fontFamily: '"Segoe UI", "Yu Gothic UI", "Yu Gothic", sans-serif',
        overflow: "hidden",
        opacity: overallFade,
      }}
    >
      <Video
        src={staticFile(`hokkaido-vlog/clips/scene${String(config.index).padStart(2, "0")}.mp4`)}
        muted
        objectFit="cover"
        style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}
      />

      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(3,8,12,.5) 0%, rgba(3,8,12,.05) 32%, rgba(3,8,12,.06) 55%, rgba(3,8,12,.76) 100%)"}} />
      <AbsoluteFill style={{boxShadow: "inset 0 0 120px rgba(0,0,0,.4)"}} />

      <div style={{position: "absolute", left: 54, right: 54, top: 38, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, letterSpacing: ".12em", textShadow: "0 2px 16px rgba(0,0,0,.85)"}}>
        <div style={{display: "flex", gap: 13, alignItems: "center"}}>
          <div style={{border: `1px solid ${config.accent}aa`, background: "rgba(3,10,15,.52)", backdropFilter: "blur(8px)", padding: "8px 12px", borderRadius: 999, color: config.accent, fontWeight: 800}}>{config.day}</div>
          <div style={{fontWeight: 650}}>{config.location}</div>
        </div>
        <div style={{color: "rgba(255,255,255,.76)", fontWeight: 700}}>HOKKAIDO <span style={{color: config.accent}}>/</span> FICTIONAL VLOG</div>
      </div>

      {config.index === 1 ? (
        <div style={{position: "absolute", left: 54, top: 118, opacity: interpolate(frame, [6, 22, 62, 80], [0, 1, 1, 0], clamp), transform: `translateY(${interpolate(frame, [6, 26], [18, 0], clamp)}px)`}}>
          <div style={{fontSize: 72, fontWeight: 850, letterSpacing: ".01em", lineHeight: 1, textShadow: "0 8px 34px rgba(0,0,0,.75)"}}>HOKKAIDO</div>
          <div style={{fontSize: 17, letterSpacing: ".28em", marginTop: 15, color: "rgba(255,255,255,.86)", textShadow: "0 4px 18px rgba(0,0,0,.75)"}}>A FICTIONAL THREE-DAY JOURNEY</div>
        </div>
      ) : null}

      <div style={{position: "absolute", left: 54, right: 54, bottom: 64, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 48}}>
        <div style={{maxWidth: 820, opacity: titleOpacity, transform: `translateY(${titleY}px)`}}>
          <div style={{width: 48, height: 4, borderRadius: 8, background: config.accent, boxShadow: `0 0 18px ${config.accent}88`, marginBottom: 15}} />
          <div style={{fontSize: 43, fontWeight: 820, lineHeight: 1.18, letterSpacing: ".01em", textShadow: "0 7px 28px rgba(0,0,0,.84)"}}>{config.title}</div>
          <div style={{fontSize: 20, lineHeight: 1.5, marginTop: 10, color: "rgba(255,255,255,.9)", textShadow: "0 4px 18px rgba(0,0,0,.9)"}}>{config.caption}</div>
        </div>

        <div style={{minWidth: 260, textAlign: "right", fontSize: 11, lineHeight: 1.55, color: "rgba(255,255,255,.7)", letterSpacing: ".05em", textShadow: "0 2px 11px rgba(0,0,0,.95)"}}>
          <div style={{fontWeight: 800, color: config.accent}}>REF-{String(config.index).padStart(2, "0")}</div>
          <div>{config.creator} · {config.license}</div>
          <div>WIKIMEDIA COMMONS → H3 I2V</div>
        </div>
      </div>

      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 5, background: "rgba(255,255,255,.13)"}}>
        <div style={{height: "100%", width: `${((globalFrame + 1) / HOKKAIDO_VLOG_DURATION) * 100}%`, background: `linear-gradient(90deg, #8fd3ff, ${config.accent})`, boxShadow: `0 0 14px ${config.accent}`}} />
      </div>
    </AbsoluteFill>
  );
};
