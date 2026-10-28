import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {Pill, Reveal, Row, c, font} from "./ui";
import {BreathLine, TouchRing, clamp, useT} from "./anim";
import {T} from "./timing";

// Report mode of the same app, shown in the client's boardroom. Only what those charged with governance may see.
const FINDINGS = [
  {t: "期末最終週への売上集中と、検収日と計上日の差", s: "会社の対応：検収手続の見直しを実施中"},
  {t: "新規得意先向け与信限度の超過と例外承認の運用", s: "会社の対応：与信管理規程を改定、承認記録を整備"},
  {t: "返品条件付き契約に基づく売上の取消可能性", s: "会社の対応：契約条件の棚卸しを開始"},
];
const INSIGHTS = [
  "与信管理規程の運用状況を、四半期ごとにモニタリング",
  "収益認識プロセスの統制（検収書の交付）を海外子会社に展開",
  "売上債権回転日数の同業比較を、経営会議の指標に追加",
];
const TREND = [112, 104, 96, 88, 82, 76];

export const ScreenReport: React.FC = () => {
  const f = useCurrentFrame();
  const draw = useT(30, 50);
  const w = 640, h = 200;
  const n = Math.max(2, Math.round(TREND.length * draw));
  const pts = TREND.slice(0, n).map((v, i) => `${(i / (TREND.length - 1)) * w},${h - ((v - 60) / 60) * h}`).join(" ");
  return (
    <AbsoluteFill style={{background: "#f7f6f2", fontFamily: font, color: "#2b2f36", padding: "52px 64px"}}>
      <Row style={{justifyContent: "space-between", alignItems: "flex-start"}}>
        <div>
          <div style={{fontSize: 18, color: "#7a7f88", letterSpacing: 3}}>監査役会・経営陣との協議　2030年11月</div>
          <div style={{fontSize: 40, fontWeight: 700, marginTop: 6, color: "#1f2a3a"}}>監査の過程で把握した事項と、経営への示唆</div>
          <div style={{fontSize: 18, color: "#7a7f88", marginTop: 6}}>ミナトホールディングス ／ 海外販売子会社 MNT Asia Trading</div>
        </div>
        <Pill tone="neutral">報告モード</Pill>
      </Row>
      <Row style={{gap: 28, marginTop: 34, alignItems: "stretch"}}>
        <div style={{flex: 1.1, background: "white", borderRadius: 14, padding: "26px 30px", boxShadow: "0 1px 2px #0001, 0 10px 28px #0000000a"}}>
          <div style={{fontSize: 20, fontWeight: 700, color: "#1f2a3a"}}>売上債権回転日数の推移と見通し</div>
          <div style={{fontSize: 15, color: "#7a7f88", marginTop: 2}}>10月時点 112日 → 対応後の見通し（点線）／ 同業中央値 71日</div>
          <svg width={w} height={h + 40} style={{marginTop: 24, overflow: "visible"}}>
            <line x1={0} x2={w} y1={h - ((71 - 60) / 60) * h} y2={h - ((71 - 60) / 60) * h} stroke="#9fb2bd" strokeDasharray="6 6" />
            <text x={0} y={h - ((71 - 60) / 60) * h + 22} fontSize={15} fill="#6f8793">同業中央値 71日</text>
            <polyline points={pts} fill="none" stroke={c.teal} strokeWidth={3} strokeDasharray="10 8" />
            {TREND.slice(0, n).map((v, i) => <circle key={i} cx={(i / (TREND.length - 1)) * w} cy={h - ((v - 60) / 60) * h} r={5} fill={i === 0 ? c.high : c.teal} />)}
            <text x={0} y={h - ((112 - 60) / 60) * h - 12} fontSize={17} fill={c.high} fontWeight={700}>112日（10月）</text>
            {draw >= 1 ? <text x={w} y={h - ((76 - 60) / 60) * h - 16} fontSize={17} fill={c.teal} fontWeight={700} textAnchor="end">見通し 76日（来期Q1）</text> : null}
            <text x={0} y={h + 30} fontSize={14} fill="#7a7f88">10月</text><text x={w} y={h + 30} fontSize={14} fill="#7a7f88" textAnchor="end">来期 3月</text>
          </svg>
          <div style={{marginTop: 20, fontSize: 15, color: "#7a7f88", lineHeight: 1.7}}>見通しは会社の対応計画（検収手続の見直し、与信規程の運用）を前提にしたモデルの推計です。</div>
        </div>
        <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 20}}>
          <div style={{background: "white", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 2px #0001, 0 10px 28px #0000000a"}}>
            <div style={{fontSize: 20, fontWeight: 700, color: "#1f2a3a", marginBottom: 8}}>把握した事項</div>
            {FINDINGS.map((x, i) => (
              <Reveal key={x.t} at={10 + i * 10}>
                <div style={{padding: "10px 0", borderBottom: "1px solid #ebe9e3"}}>
                  <div style={{fontSize: 18, lineHeight: 1.5}}><span style={{color: c.teal, fontWeight: 700, marginRight: 8}}>{i + 1}</span>{x.t}</div>
                  <div style={{fontSize: 15, color: "#7a7f88", marginTop: 3, marginLeft: 22}}>{x.s}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{background: "#1f2a3a", color: "#eef2f6", borderRadius: 14, padding: "24px 28px", flex: 1}}>
            <Row style={{justifyContent: "space-between"}}><div style={{fontSize: 20, fontWeight: 700}}>経営への示唆</div><Pill tone="ai">3件</Pill></Row>
            {INSIGHTS.map((x, i) => (
              <Reveal key={x} at={60 + i * 14}>
                <div style={{display: "grid", gridTemplateColumns: "28px 1fr", gap: 8, padding: "11px 0", borderBottom: `1px solid ${c.aiLine}22`, fontSize: 18, lineHeight: 1.55}}><span style={{color: c.aiLine, fontWeight: 700}}>{i + 1}</span><span>{x}</span></div>
              </Reveal>
            ))}
            <BreathLine phases={[[0, "done"]]} style={{marginTop: 14}} />
          </div>
        </div>
      </Row>
      <div style={{position: "absolute", left: 64, right: 64, bottom: 30, display: "flex", justifyContent: "space-between", fontSize: 14, color: "#8a8f98"}}>
        <span>AIによる分析支援を活用。判断と報告の責任は監査人にあります。</span><span>役員のタブレットと同期中</span>
      </div>
    </AbsoluteFill>
  );
};

/* 役員のタブレット（4:3、P8 に合成）：同じ報告書が同期し、示唆の1行を指でなぞると「次四半期のモニタリング指標」に追加される */
export const ScreenReportTablet: React.FC = () => {
  const f = useCurrentFrame();
  const trace = interpolate(f, [T.report.trace, T.report.traceEnd], [0, 1], clamp);
  const added = f >= T.report.add;
  return (
    <AbsoluteFill style={{background: "#0f1626", fontFamily: font, color: "#e6ecf4", padding: 60}}>
      <Row style={{justifyContent: "space-between"}}>
        <div><div style={{fontSize: 22, color: c.aiMuted, letterSpacing: 3}}>同期表示</div><div style={{fontSize: 40, fontWeight: 700, marginTop: 4}}>経営への示唆</div></div>
        <Pill tone="ai">閲覧のみ</Pill>
      </Row>
      <div style={{marginTop: 470}}>
        {INSIGHTS.map((x, i) => (
          <div key={x} style={{position: "relative", padding: "22px 24px", borderRadius: 16, marginBottom: 16, fontSize: 32, lineHeight: 1.5,
            background: i === 2 && trace > 0 ? `rgba(63,193,201,${0.10 + 0.12 * trace})` : "#172038", border: `1px solid ${i === 2 && trace > 0 ? c.aiLine : "transparent"}`}}>
            <span style={{color: c.aiLine, fontWeight: 700, marginRight: 12}}>{i + 1}</span>{x}
            {i === 2 && trace > 0 ? <div style={{position: "absolute", left: 600, width: 440 * trace, bottom: 12, height: 4, background: c.aiLine, borderRadius: 2, boxShadow: `0 0 10px ${c.aiLine}`}} /> : null}
          </div>
        ))}
      </div>
      {added ? <Reveal at={T.report.add}><div style={{marginTop: 16, padding: "18px 26px", borderRadius: 16, background: `${c.aiLine}22`, border: `1px solid ${c.aiLine}`, fontSize: 28, lineHeight: 1.5}}>
        <Row style={{justifyContent: "space-between"}}><span style={{fontSize: 20, color: c.aiLine}}>次四半期のモニタリング指標に追加</span><Pill tone="ai">追加済み</Pill></Row>
        <div style={{marginTop: 6}}>売上債権回転日数（同業比較）</div>
      </div></Reveal> : null}
      <BreathLine phases={[[0, "done"], [T.report.trace, "listen"], [T.report.traceEnd, "think"], [T.report.add, "done"]]} style={{position: "absolute", left: 60, right: 60, bottom: 40}} />
      <TouchRing at={T.report.trace} x={T.report.p1[0]} y={T.report.p1[1]} hold={T.report.traceEnd - T.report.trace} />
      <TouchRing at={T.report.add} x={T.report.p2[0]} y={T.report.p2[1]} />
    </AbsoluteFill>
  );
};
