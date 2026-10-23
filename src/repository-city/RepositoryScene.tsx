import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from "remotion";
import type {RepositorySceneConfig} from "./types";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const panelStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.11)",
  background: "rgba(8,13,22,0.76)",
  boxShadow: "0 28px 80px rgba(0,0,0,0.34)",
  backdropFilter: "blur(16px)",
};

const CityVisual: React.FC<{config: RepositorySceneConfig; frame: number}> = ({config, frame}) => {
  const heights = [172, 236, 142, 284, 198, 250, 160];
  return (
    <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", gap: 18, padding: "72px 60px 56px"}}>
      {heights.map((height, i) => {
        const grow = spring({frame: frame - i * 4, fps: 24, config: {damping: 18, stiffness: 90}});
        return (
          <div key={height} style={{flex: 1, height: height * grow, minHeight: 2, borderRadius: "12px 12px 4px 4px", border: `1px solid ${config.accent}66`, background: `linear-gradient(180deg, ${i % 2 ? config.accent2 : config.accent}38, rgba(4,9,16,0.86))`, boxShadow: `0 0 28px ${config.accent}18`, overflow: "hidden"}}>
            {Array.from({length: 7}).map((_, row) => (
              <div key={row} style={{height: 4, margin: "13px 11px 0", borderRadius: 4, background: row === (Math.floor(frame / 12) + i) % 7 ? config.accent : "rgba(255,255,255,0.14)", opacity: 0.8}} />
            ))}
          </div>
        );
      })}
      <div style={{position: "absolute", left: 54, right: 54, bottom: 49, height: 2, background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)`, opacity: 0.72}} />
    </div>
  );
};

const JournalVisual: React.FC<{config: RepositorySceneConfig; frame: number}> = ({config, frame}) => (
  <div style={{position: "absolute", inset: 0, padding: "55px 58px"}}>
    {Array.from({length: 5}).map((_, i) => {
      const enter = spring({frame: frame - i * 8, fps: 24, config: {damping: 18, stiffness: 110}});
      const active = Math.floor(frame / 28) % 5 === i;
      return (
        <div key={i} style={{position: "absolute", left: 58 + i * 19, right: 58 - i * 8, top: 54 + i * 62, height: 82, borderRadius: 14, border: `1px solid ${active ? config.accent : "rgba(255,255,255,0.12)"}`, background: active ? `linear-gradient(90deg, ${config.accent}2b, rgba(10,15,24,0.96))` : "rgba(10,15,24,0.9)", transform: `translateX(${(1 - enter) * 90}px)`, opacity: enter, boxShadow: active ? `0 0 32px ${config.accent}1c` : "none", display: "flex", alignItems: "center", padding: "0 24px", gap: 18}}>
          <div style={{width: 38, height: 38, borderRadius: 10, border: `1px solid ${config.accent}88`, display: "grid", placeItems: "center", color: config.accent, fontSize: 15, fontWeight: 700}}>{String(i + 1).padStart(2, "0")}</div>
          <div style={{flex: 1}}>
            <div style={{height: 7, width: `${82 - i * 6}%`, borderRadius: 6, background: active ? config.accent : "rgba(255,255,255,0.23)", marginBottom: 12}} />
            <div style={{height: 5, width: `${58 + i * 4}%`, borderRadius: 6, background: "rgba(255,255,255,0.12)"}} />
          </div>
          <div style={{fontSize: 11, color: "rgba(255,255,255,0.42)", letterSpacing: "0.14em"}}>COMMIT</div>
        </div>
      );
    })}
  </div>
);

const SheetVisual: React.FC<{config: RepositorySceneConfig; frame: number}> = ({config, frame}) => {
  const cursorX = interpolate(frame, [0, 191], [82, 500], {...clamp, easing: Easing.inOut(Easing.ease)});
  const cursorY = 98 + Math.sin(frame / 15) * 105;
  return (
    <div style={{position: "absolute", inset: 0, padding: 48}}>
      <div style={{position: "absolute", inset: 54, borderRadius: 18, border: "1px solid rgba(255,255,255,0.13)", background: "rgba(250,252,255,0.055)", overflow: "hidden"}}>
        <div style={{height: 42, background: `linear-gradient(90deg, ${config.accent}33, rgba(255,255,255,0.035))`, borderBottom: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", paddingLeft: 18, gap: 8}}>
          {[0,1,2].map((i) => <div key={i} style={{width: 8, height: 8, borderRadius: "50%", background: i === 0 ? config.accent : "rgba(255,255,255,0.22)"}} />)}
        </div>
        <div style={{position: "absolute", left: 0, right: 0, top: 42, bottom: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.075) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.075) 1px, transparent 1px)", backgroundSize: "64px 43px"}} />
        {[0,1,2].map((i) => {
          const visible = spring({frame: frame - 12 - i * 12, fps: 24, config: {damping: 20}});
          return <div key={i} style={{position: "absolute", left: 84 + i * 112, top: 92 + i * 70, width: 196, height: 74, borderRadius: 10, border: `1px solid ${config.accent}${i === 1 ? "cc" : "66"}`, background: `linear-gradient(135deg, ${config.accent}26, rgba(8,14,23,0.94))`, opacity: visible, transform: `scale(${0.88 + visible * 0.12})`, boxShadow: `0 0 26px ${config.accent}12`}} />;
        })}
        <div style={{position: "absolute", left: cursorX, top: cursorY, width: 22, height: 30, clipPath: "polygon(0 0, 0 100%, 7px 73%, 13px 94%, 19px 91%, 13px 70%, 22px 70%)", background: config.accent, filter: `drop-shadow(0 0 8px ${config.accent})`}} />
      </div>
    </div>
  );
};

const DataVisual: React.FC<{config: RepositorySceneConfig; frame: number}> = ({config, frame}) => (
  <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 30, padding: "70px 46px"}}>
    {[0,1,2,3].map((i) => {
      const stacks = 3 + i;
      const appear = spring({frame: frame - i * 7, fps: 24, config: {damping: 18}});
      return (
        <div key={i} style={{width: 102, height: 84 + stacks * 36, position: "relative", opacity: appear, transform: `translateY(${(1 - appear) * 60}px)`}}>
          {Array.from({length: stacks}).map((_, row) => (
            <div key={row} style={{position: "absolute", left: 0, right: 0, bottom: row * 35, height: 52, borderRadius: "50%", border: `1px solid ${config.accent}${row === Math.floor(frame / 18) % stacks ? "cc" : "55"}`, background: row === stacks - 1 ? `linear-gradient(180deg, ${config.accent}55, rgba(8,13,21,.95))` : "rgba(8,13,21,.96)", boxShadow: row === Math.floor(frame / 18) % stacks ? `0 0 24px ${config.accent}22` : "none"}} />
          ))}
          <div style={{position: "absolute", left: 0, right: 0, bottom: -28, textAlign: "center", color: "rgba(255,255,255,.45)", fontSize: 11, letterSpacing: ".12em"}}>COMPANY {i + 1}</div>
        </div>
      );
    })}
  </div>
);

const TwinVisual: React.FC<{config: RepositorySceneConfig; frame: number}> = ({config, frame}) => {
  const nodes = [
    [306, 70], [184, 152], [428, 152], [106, 258], [230, 258], [382, 258], [506, 258], [66, 370], [146, 370], [202, 370], [272, 370], [344, 370], [416, 370], [480, 370], [544, 370],
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,7],[3,8],[4,9],[4,10],[5,11],[5,12],[6,13],[6,14]];
  const draw = interpolate(frame, [8, 120], [0, 1], clamp);
  return (
    <svg viewBox="0 0 612 438" style={{position: "absolute", inset: 22, width: "calc(100% - 44px)", height: "calc(100% - 44px)"}}>
      {edges.map(([a,b], i) => {
        const [x1,y1]=nodes[a]; const [x2,y2]=nodes[b];
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 4 === Math.floor(frame / 18) % 4 ? config.accent : "rgba(255,255,255,.14)"} strokeWidth={i % 4 === Math.floor(frame / 18) % 4 ? 2.5 : 1} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />;
      })}
      {nodes.map(([x,y], i) => {
        const show = spring({frame: frame - 4 - i * 3, fps: 24, config: {damping: 18}});
        const active = i === Math.floor(frame / 12) % nodes.length;
        return <g key={i} opacity={show} transform={`translate(${x} ${y}) scale(${0.6 + show * 0.4})`}><circle r={active ? 15 : 10} fill={active ? config.accent : "#0b111c"} stroke={active ? config.accent2 : `${config.accent}88`} strokeWidth={2} /><circle r={active ? 4 : 2.5} fill={active ? "white" : config.accent} /></g>;
      })}
    </svg>
  );
};

const EditVisual: React.FC<{config: RepositorySceneConfig; frame: number}> = ({config, frame}) => {
  const playhead = interpolate(frame, [0, 191], [62, 548], clamp);
  return (
    <div style={{position: "absolute", inset: 0, padding: "62px 52px"}}>
      <div style={{height: 238, borderRadius: 18, border: "1px solid rgba(255,255,255,.12)", background: `radial-gradient(circle at ${40 + frame / 5}% 45%, ${config.accent}3d, transparent 32%), rgba(7,12,20,.9)`, display: "grid", placeItems: "center", overflow: "hidden"}}>
        <div style={{width: 96, height: 96, borderRadius: "50%", border: `2px solid ${config.accent}`, display: "grid", placeItems: "center", boxShadow: `0 0 46px ${config.accent}35`, transform: `scale(${1 + Math.sin(frame / 10) * 0.03})`}}>
          <div style={{marginLeft: 9, width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: `29px solid ${config.accent}`}} />
        </div>
      </div>
      <div style={{position: "relative", marginTop: 28, height: 94}}>
        {[0,1,2].map((track) => <div key={track} style={{position: "absolute", left: 10 + track * 34, right: 10, top: track * 30, height: 19, borderRadius: 5, background: `linear-gradient(90deg, ${track === 1 ? config.accent2 : config.accent}55, rgba(255,255,255,.08))`, border: "1px solid rgba(255,255,255,.1)"}} />)}
        <div style={{position: "absolute", left: playhead, top: -8, bottom: -8, width: 2, background: config.accent, boxShadow: `0 0 12px ${config.accent}`}} />
      </div>
    </div>
  );
};

const CouncilVisual: React.FC<{config: RepositorySceneConfig; frame: number}> = ({config, frame}) => {
  const colors = ["#52d6a3", "#86bc25", "#ffb84d", "#ff6b91", "#54c9ff"];
  const positions = [[306,72],[112,205],[500,205],[184,365],[428,365]];
  const center = [306,238];
  return (
    <svg viewBox="0 0 612 438" style={{position: "absolute", inset: 22, width: "calc(100% - 44px)", height: "calc(100% - 44px)"}}>
      {positions.map(([x,y],i) => {
        const progress = interpolate(frame, [i * 7, 80 + i * 7], [0,1], clamp);
        return <line key={`l${i}`} x1={x} y1={y} x2={center[0]} y2={center[1]} stroke={colors[i]} strokeOpacity={0.55} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1-progress} />;
      })}
      <circle cx={center[0]} cy={center[1]} r={54 + Math.sin(frame / 12) * 3} fill={`${config.accent}18`} stroke={config.accent} strokeWidth={2} />
      <text x={center[0]} y={center[1]+8} fill="white" textAnchor="middle" fontSize="25" fontWeight="700">LOOP</text>
      {positions.map(([x,y],i) => {
        const show=spring({frame:frame-i*8,fps:24,config:{damping:16}});
        return <g key={i} opacity={show} transform={`translate(${x} ${y}) scale(${0.6+show*0.4})`}><circle r="39" fill="#0b111c" stroke={colors[i]} strokeWidth="2" /><circle r="26" fill={`${colors[i]}22`} /><text y="6" fill={colors[i]} textAnchor="middle" fontSize="16" fontWeight="800">{["MW","AI","DD","CT","DV"][i]}</text></g>;
      })}
    </svg>
  );
};

const VisualPanel: React.FC<{config: RepositorySceneConfig; frame: number}> = ({config, frame}) => {
  if (config.mode === "journal") return <JournalVisual config={config} frame={frame} />;
  if (config.mode === "sheet") return <SheetVisual config={config} frame={frame} />;
  if (config.mode === "data") return <DataVisual config={config} frame={frame} />;
  if (config.mode === "twin") return <TwinVisual config={config} frame={frame} />;
  if (config.mode === "edit") return <EditVisual config={config} frame={frame} />;
  if (config.mode === "council") return <CouncilVisual config={config} frame={frame} />;
  return <CityVisual config={config} frame={frame} />;
};

export const RepositoryScene: React.FC<{config: RepositorySceneConfig}> = ({config}) => {
  const frame = useCurrentFrame();
  const durationInFrames = 192;
  const fade = config.index === 1
    ? interpolate(frame, [0, 10], [0, 1], clamp)
    : config.index === 38
      ? interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [1, 0], clamp)
      : 1;
  const intro = spring({frame, fps: 24, config: {damping: 18, stiffness: 90}});
  const scan = interpolate(frame, [0, durationInFrames - 1], [-10, 110], clamp);
  const progress = ((config.index - 1) * durationInFrames + frame) / (38 * durationInFrames);

  return (
    <AbsoluteFill style={{backgroundColor: "#050914", color: "white", fontFamily: '"Segoe UI", "Yu Gothic UI", "Yu Gothic", sans-serif', overflow: "hidden", opacity: fade}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 78% 30%, ${config.accent}1f 0%, transparent 34%), radial-gradient(circle at 20% 85%, ${config.accent2}12 0%, transparent 38%), linear-gradient(145deg, #050914 0%, #09111e 52%, #040712 100%)`}} />
      <AbsoluteFill style={{opacity: 0.17, backgroundImage: "linear-gradient(rgba(255,255,255,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.13) 1px, transparent 1px)", backgroundSize: "48px 48px", transform: `perspective(700px) rotateX(61deg) translateY(${245 + frame * 0.15}px) scale(1.8)`, transformOrigin: "center bottom"}} />
      <div style={{position: "absolute", left: `${scan}%`, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, transparent, ${config.accent}77, transparent)`, filter: "blur(.2px)", opacity: 0.46}} />

      <div style={{position: "absolute", left: 68, right: 68, top: 38, display: "flex", alignItems: "center", justifyContent: "space-between", letterSpacing: ".14em", fontSize: 13, color: "rgba(255,255,255,.55)"}}>
        <div><span style={{color: config.accent, fontWeight: 800}}>REPOSITORY CITY</span><span style={{margin: "0 10px", color: "rgba(255,255,255,.2)"}}>//</span>{config.chapter}</div>
        <div>{String(config.index).padStart(2,"0")} / 38<span style={{marginLeft: 18, color: "rgba(255,255,255,.28)"}}>8.00 SEC</span></div>
      </div>

      <div style={{position: "absolute", left: 68, top: 92, width: 378, bottom: 108, borderRadius: 25, ...panelStyle, padding: "34px 34px", transform: `translateX(${(1 - intro) * -42}px)`, opacity: intro}}>
        <div style={{display: "flex", alignItems: "center", gap: 21}}>
          <div style={{width: 86, height: 86, borderRadius: 25, border: `1px solid ${config.accent}aa`, background: `linear-gradient(145deg, ${config.accent}30, rgba(255,255,255,.035))`, display: "grid", placeItems: "center", color: config.accent, fontWeight: 850, fontSize: config.initials === "∞" ? 44 : 29, letterSpacing: ".03em", boxShadow: `0 0 34px ${config.accent}1c`}}>{config.initials}</div>
          <div>
            <div style={{fontSize: 26, fontWeight: 750, letterSpacing: ".02em"}}>{config.character}</div>
            <div style={{fontSize: 12, marginTop: 9, letterSpacing: ".16em", color: config.accent}}>{config.role}</div>
          </div>
        </div>

        <div style={{marginTop: 33, borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 25}}>
          <div style={{fontSize: 13, color: "rgba(255,255,255,.42)", letterSpacing: ".12em", marginBottom: 10}}>REPOSITORY</div>
          <div style={{fontSize: 19, fontWeight: 650, color: "rgba(255,255,255,.9)", overflowWrap: "anywhere"}}>{config.repository}</div>
        </div>

        {config.metric ? <div style={{position: "absolute", left: 34, right: 34, bottom: 34, borderRadius: 12, border: `1px solid ${config.accent}55`, background: `${config.accent}13`, color: config.accent2, fontSize: 14, fontWeight: 750, letterSpacing: ".1em", padding: "14px 16px", textAlign: "center"}}>{config.metric}</div> : null}
      </div>

      <div style={{position: "absolute", left: 478, right: 68, top: 92, bottom: 108, borderRadius: 25, ...panelStyle, overflow: "hidden", transform: `translateX(${(1 - intro) * 48}px)`, opacity: intro}}>
        <VisualPanel config={config} frame={frame} />
        <div style={{position: "absolute", inset: 0, pointerEvents: "none", boxShadow: `inset 0 0 80px ${config.accent}0d`}} />
      </div>

      <div style={{position: "absolute", left: 68, right: 68, bottom: 42, display: "flex", alignItems: "flex-end", gap: 34, opacity: interpolate(frame, [8,26], [0,1], clamp), transform: `translateY(${interpolate(frame, [8,30], [18,0], clamp)}px)`}}>
        <div style={{width: 7, height: 72, borderRadius: 6, background: `linear-gradient(180deg, ${config.accent}, ${config.accent2})`, boxShadow: `0 0 20px ${config.accent}44`}} />
        <div style={{flex: 1}}>
          <div style={{fontSize: 36, fontWeight: 780, lineHeight: 1.2, letterSpacing: ".01em", textShadow: "0 6px 24px rgba(0,0,0,.4)"}}>{config.title}</div>
          <div style={{fontSize: 17, lineHeight: 1.55, marginTop: 9, color: "rgba(255,255,255,.66)"}}>{config.detail}</div>
        </div>
      </div>

      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: "rgba(255,255,255,.06)"}}>
        <div style={{height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${config.accent2}, ${config.accent})`, boxShadow: `0 0 12px ${config.accent}`}} />
      </div>
    </AbsoluteFill>
  );
};
