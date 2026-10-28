import {AbsoluteFill} from "remotion";
import {aiPanel, c, font} from "./ui";
import {BreathLine, TouchRing, useTranscript} from "./anim";

/** Component check: breathing line states, touch ring, live transcript. Not part of the film. */
export const LineTest: React.FC = () => {
  const q = useTranscript("売上高・売上債権のスコアが高い背景を説明してください。", 10);
  return (
    <AbsoluteFill style={{background: c.bg, fontFamily: font, padding: 80, color: c.text}}>
      <div style={{...aiPanel, padding: 36, width: 1200}}>
        <div style={{fontSize: 18, color: c.aiMuted, marginBottom: 8}}>分析アシスタント</div>
        <div style={{fontSize: 28, minHeight: 44}}>{q.shown}<span style={{opacity: q.live ? 0.5 : 0}}>▍</span></div>
        <BreathLine phases={[[0, "listen"], [60, "think"], [120, "answer"], [170, "done"]]} style={{marginTop: 24}} />
        <div style={{fontSize: 16, color: c.aiMuted, marginTop: 10}}>0–59 聞き取り ／ 60–119 思考 ／ 120– 回答</div>
      </div>
      <div style={{position: "relative", width: 600, height: 200, marginTop: 40, background: "white", borderRadius: 12}}>
        <TouchRing at={30} x={120} y={100} hold={12} />
        <TouchRing at={90} x={400} y={100} />
      </div>
    </AbsoluteFill>
  );
};
