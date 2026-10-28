import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from "remotion";
import {AppShell, Button, H, Kpi, Panel, Pill, Reveal, Row, Score, c, panel, aiPanel} from "./ui";
import {BreathLine, GrowBar, TouchRing, clamp, useT, useTranscript, useTyped} from "./anim";
import * as D from "./data";
import {T} from "./timing";

/* 1. トップ：夜間のAI作業の要点 → 分布の棒にタッチ → 会社の行にタッチ（P1 の机上画面に合成） */
export const ScreenTop: React.FC = () => {
  const f = useCurrentFrame();
  const max = Math.max(...D.HISTOGRAM.map((h) => h.n));
  const tap1 = f >= T.top.tap1, tap2 = f >= T.top.tap2;
  const leave = interpolate(f, [T.top.tap2 + 12, T.top.tap2 + 44], [0, 1], clamp);
  return (
    <AbsoluteFill>
    <AppShell active={0} crumbs={["ダッシュボード", "子会社リスクスコア"]}>
      <div style={{opacity: 1 - leave, transform: `scale(${1 - leave * 0.02})`, transformOrigin: "50% 50%", height: "100%", position: "relative"}}>
        <Row style={{justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16}}>
          <H sub="機械学習モデルによる確認優先度（0〜100）。不正の確率ではありません。">子会社リスクスコアの分布</H>
          <Pill tone="teal">2030年3月期 第3四半期まで</Pill>
        </Row>
        <Row style={{gap: 16, marginBottom: 18, alignItems: "stretch"}}>
          <Kpi label="対象子会社" value="20社" note="連結子会社" />
          <Kpi label="スコア 75以上" value="1社" note="MNT Asia Trading" tone="high" />
          <Kpi label="前月から上昇" value="3社" note="+10pt以上" />
          <div style={{...aiPanel, padding: "14px 20px", flex: 1.9}}>
            <Row style={{justifyContent: "space-between"}}><span style={{fontSize: 15, color: c.aiMuted}}>夜間のAI作業　06:12 完了</span><Pill tone="ai">所要 14分</Pill></Row>
            <div style={{fontSize: 16, lineHeight: 1.65, marginTop: 6}}>
              20社を再分析し、3社のスコアを更新しました。<br />
              <span style={{color: c.high, fontWeight: 700}}>MNT Asia Trading</span> が +33 で要確認。売上高・売上債権の区分から確認を推奨します。
            </div>
            <BreathLine phases={[[0, "done"]]} style={{marginTop: 4}} />
          </div>
        </Row>
        <Row style={{gap: 18, alignItems: "stretch"}}>
          <Panel title="リスクスコア別の会社数" style={{flex: 1.35, position: "relative"}}>
            <div style={{position: "relative", height: 470, marginTop: 10}}>
              <div style={{position: "absolute", left: 60, right: 10, top: 10, bottom: 56, borderLeft: `1px solid ${c.line}`, borderBottom: `1px solid ${c.line}`}}>
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <div key={v} style={{position: "absolute", left: 0, right: 0, bottom: `${(v / max) * 100}%`, borderTop: v ? `1px dashed ${c.line}` : "none"}}>
                    <span style={{position: "absolute", left: -34, top: -11, fontSize: 15, color: c.muted}}>{v}</span>
                  </div>
                ))}
                <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", gap: 14, padding: "0 16px"}}>
                  {D.HISTOGRAM.map((h) => {
                    const pct = (h.n / max) * 100;
                    return (
                      <div key={h.bin} style={{flex: 1, position: "relative", height: "100%", display: "flex", alignItems: "flex-end"}}>
                        <div style={{width: "100%", height: `${pct}%`, background: h.hit ? c.high : c.low, borderRadius: "6px 6px 0 0",
                          boxShadow: h.hit && tap1 ? `0 0 0 4px ${c.amberSoft}` : "none"}} />

                        <div style={{position: "absolute", top: "100%", left: 0, right: 0, textAlign: "center", fontSize: 15, color: c.muted, marginTop: 8}}>{h.bin}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{position: "absolute", left: 60, right: 10, bottom: 8, textAlign: "center", fontSize: 16, color: c.muted}}>リスクスコア</div>
              <div style={{position: "absolute", left: -6, top: "40%", rotate: "-90deg", fontSize: 16, color: c.muted}}>会社数</div>
            </div>
          </Panel>
          <Panel title="スコア上位の子会社" right={<span style={{fontSize: 15, color: c.muted}}>タップで内訳</span>} style={{flex: 1}}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 170px 70px 80px", fontSize: 15, color: c.muted, padding: "0 10px 8px"}}>
              <span>子会社</span><span>事業</span><span style={{textAlign: "right"}}>スコア</span><span style={{textAlign: "right"}}>前月比</span>
            </div>
            {D.COMPANIES.map((k) => (
              <div key={k.name} style={{display: "grid", gridTemplateColumns: "1fr 170px 70px 80px", alignItems: "center", padding: "13px 10px", fontSize: 19,
                background: k.hit ? (tap2 ? c.amberSoft : tap1 ? "#fbf4ea" : "transparent") : "transparent", borderRadius: 8, marginBottom: 4,
                boxShadow: k.hit && tap2 ? `inset 0 0 0 1px ${c.high}` : "none"}}>
                <span style={{fontWeight: k.hit ? 700 : 500}}>{k.name}</span>
                <span style={{color: c.muted, fontSize: 16}}>{k.biz}</span>
                <span style={{textAlign: "right"}}><Score v={k.score} size={22} /></span>
                <span style={{textAlign: "right", fontSize: 16, color: k.prev === 0 ? c.muted : k.score - k.prev > 0 ? c.high : c.muted}}>{k.prev === 0 ? "新規" : (k.score - k.prev > 0 ? "+" : "") + (k.score - k.prev)}</span>
              </div>
            ))}
          </Panel>
        </Row>
        {tap1 ? <div style={{position: "absolute", left: T.top.p2[0] - 90, top: T.top.p1[1] - 150, width: T.top.p1[0] - T.top.p2[0] + 230, ...panel, padding: "14px 18px", fontSize: 17,
          boxShadow: "0 12px 36px #0b1a2e22", border: `1px solid ${tap2 ? c.high : c.line}`, opacity: interpolate(f, [T.top.tap1, T.top.tap1 + 8], [0, 1], clamp)}}>
          <Row style={{justifyContent: "space-between"}}>
            <Button primary pressed={tap2} style={{padding: "8px 16px", fontSize: 16}}>内訳を表示</Button>
            <span><b style={{fontSize: 19}}>{D.TARGET.name}</b>　スコア <Score v={87} size={20} />　<span style={{color: c.muted}}>前月 54　＋33</span></span>
          </Row>
          <div style={{marginTop: 8, color: c.muted, fontSize: 15}}>売上高・売上債権の寄与が最大（38pt）。夜間の再分析で +33。</div>
        </div> : null}
        <TouchRing at={T.top.tap1} x={T.top.p1[0]} y={T.top.p1[1]} />
        <TouchRing at={T.top.tap2} x={T.top.p2[0]} y={T.top.p2[1]} />
      </div>
    </AppShell>
    {/* The drilldown opens in place; the next full-screen cut continues it (cut offset = 192 - this start). */}
    <Sequence from={T.top.tap2 + 40}><ScreenDrilldown /></Sequence>
    </AbsoluteFill>
  );
};

/* 2. ドリルダウン：科目区分の内訳 → 区分を長押し → 指標 → 「AIに聞く」にタッチ → 聞き取り開始 */
export const ScreenDrilldown: React.FC = () => {
  const f = useCurrentFrame();
  const maxPts = D.CATEGORIES[0].pts;
  const selected = f >= T.drill.press + 10;
  const w = 560, h = 150;
  const draw = useT(T.drill.press + 30, 50);
  const n = Math.max(2, Math.round(D.TREND.length * draw));
  const pts = D.TREND.slice(0, n).map((v, i) => `${(i / (D.TREND.length - 1)) * w},${h - ((v - 60) / 60) * h}`).join(" ");
  const asked = f >= T.drill.ask;
  const bar = interpolate(f, [T.drill.ask + 4, T.drill.ask + 18], [0, 1], clamp);
  return (
    <AppShell active={2} crumbs={["子会社一覧", D.TARGET.name, "スコアの内訳"]}>
      <Row style={{justifyContent: "space-between", marginBottom: 16}}>
        <div style={{fontSize: 30, fontWeight: 700, color: c.navy}}>{D.TARGET.name} <span style={{fontSize: 18, color: c.muted, fontWeight: 400, marginLeft: 10}}>{D.TARGET.region}</span></div>
        <Row style={{gap: 26}}>
          <div><div style={{fontSize: 15, color: c.muted}}>総合スコア</div><Score v={D.TARGET.score} size={40} /></div>
          <div><div style={{fontSize: 15, color: c.muted}}>前月</div><div style={{fontSize: 28, fontWeight: 700}}>{D.TARGET.prev} <span style={{color: c.high, fontSize: 20}}>▲33</span></div></div>
          <Pill tone="high">要確認</Pill>
        </Row>
      </Row>
      <Row style={{gap: 18, alignItems: "stretch"}}>
        <Panel title="科目区分ごとのスコア内訳" right={<span style={{fontSize: 15, color: c.muted}}>合計 87pt ／ 区分を長押しで指標を表示</span>} style={{flex: 1.1, position: "relative"}}>
          {D.CATEGORIES.map((k, i) => (
            <div key={k.name} style={{display: "grid", gridTemplateColumns: "190px 1fr 64px", alignItems: "center", gap: 14, padding: "11px 12px", borderRadius: 8,
              background: k.hit && selected ? c.amberSoft : "transparent", boxShadow: k.hit && selected ? `inset 0 0 0 1px ${c.high}` : "none", marginBottom: 6, fontSize: 19}}>
              <span style={{fontWeight: k.hit ? 700 : 500}}>{k.name}</span>
              <GrowBar pct={(k.pts / maxPts) * 100} color={k.hit ? c.high : c.low} start={4 + i * 4} />
              <span style={{textAlign: "right", fontWeight: 700, color: k.hit ? c.high : c.navy}}>{k.pts}pt</span>
            </div>
          ))}
          <div style={{fontSize: 15, color: c.muted, marginTop: 10}}>内訳は各区分の指標がスコアに寄与した点数。モデルの説明可能性（SHAP値）に基づく表示。</div>
          <TouchRing at={T.drill.press} x={120} y={78} hold={12} />
        </Panel>
        <Panel title={selected ? "売上高・売上債権：主要指標" : "主要指標"} right={selected ? <Pill tone="high">寄与 38pt</Pill> : <span style={{fontSize: 15, color: c.muted}}>区分を選択してください</span>} style={{flex: 1, position: "relative"}}>
          {selected ? <>
            {D.INDICATORS.map((k, i) => (
              <Reveal key={k.name} at={T.drill.press + 14 + i * 6}>
                <Row style={{justifyContent: "space-between", padding: "11px 6px", borderBottom: `1px solid ${c.line}`, fontSize: 19}}>
                  <span>{k.name}</span>
                  <Row style={{gap: 12}}><span style={{fontSize: 15, color: c.muted}}>{k.ref}</span><b style={{color: k.tone === "high" ? c.high : "#9a6b1c", fontSize: 22}}>{k.value}</b></Row>
                </Row>
              </Reveal>
            ))}
            <Reveal at={T.drill.press + 30}>
              <div style={{marginTop: 18, fontSize: 16, color: c.muted}}>売上債権回転日数の推移（月次）</div>
              <svg width={w} height={h + 20} style={{marginTop: 6, overflow: "visible"}}>
                <polyline points={pts} fill="none" stroke={c.high} strokeWidth={3} />
                {D.TREND.slice(0, n).map((v, i) => <circle key={i} cx={(i / (D.TREND.length - 1)) * w} cy={h - ((v - 60) / 60) * h} r={4} fill={c.high} />)}
                {draw >= 1 ? <text x={w} y={h - ((112 - 60) / 60) * h - 12} textAnchor="end" fontSize={16} fill={c.high} fontWeight={700}>112日</text> : null}
                <text x={0} y={h + 16} fontSize={14} fill={c.muted}>1月</text><text x={w} y={h + 16} fontSize={14} fill={c.muted} textAnchor="end">10月</text>
              </svg>
            </Reveal>
            <Reveal at={T.drill.press + 60}><Row style={{justifyContent: "flex-end", marginTop: 14}}><Button primary pressed={asked}>この区分についてAIに聞く</Button></Row></Reveal>
            <TouchRing at={T.drill.ask} x={700} y={610} />
          </> : <div style={{height: 520, display: "grid", placeItems: "center", color: c.muted, fontSize: 18}}>左の科目区分を長押しすると、関連する指標と推移を表示します。</div>}
        </Panel>
      </Row>
      {asked ? <div style={{position: "absolute", left: 0, right: 0, bottom: 0, ...aiPanel, padding: "18px 28px", opacity: bar, transform: `translateY(${(1 - bar) * 30}px)`}}>
        <Row style={{justifyContent: "space-between"}}>
          <span style={{fontSize: 18}}>分析アシスタント　<span style={{color: c.aiMuted, fontSize: 16}}>文脈：{D.TARGET.name} ／ 売上高・売上債権</span></span>
          <span style={{fontSize: 16, color: c.aiMuted}}>聞いています…　話しかけるか、タップして入力</span>
        </Row>
        <BreathLine phases={[[T.drill.ask + 10, "listen"]]} style={{marginTop: 8}} />
      </div> : null}
    </AppShell>
  );
};

/* 3. AIとの対話（384フレーム）：聞き取り → 文字起こし中に参照候補が先に並ぶ → 思考（呼吸する線）→ 回答のストリーミング → 根拠にタッチで契約書 */
const PRE = [
  {at: 10, name: "売上明細（2030年3月期 Q1–Q3）"},
  {at: 24, name: "与信管理台帳"},
  {at: 40, name: "販売契約書（新規得意先3社）"},
  {at: 56, name: "取締役会議事録（第3四半期）"},
  {at: 72, name: "入金明細（基準日＋20日）"},
];

export const ScreenAsk: React.FC = () => {
  const f = useCurrentFrame();
  const q = useTranscript(D.QUESTION, T.ask.speakStart, 9.5);
  const thinking = f >= T.ask.speakEnd && f < T.ask.answer;
  const answered = f >= T.ask.answer;
  const intro = useTyped("投入済みのクライアントデータと関連資料を参照し、スコアが高い背景を整理しました。", T.ask.answer, 22);
  const cited = f >= T.ask.cite;
  const slide = interpolate(f, [T.ask.cite + 4, T.ask.cite + 20], [0, 1], clamp);
  const closing = useTyped("次に、確認すべき論点を整理し、スコアの再分析と関連資料の探索を進めます。", T.ask.close, 22);
  return (
    <AppShell active={2} crumbs={["スコア分析", D.TARGET.name, "売上高・売上債権", "AIに聞く"]}>
      <Row style={{gap: 18, alignItems: "stretch", height: "100%"}}>
        <div style={{flex: 1, ...aiPanel, padding: "22px 28px", position: "relative", display: "flex", flexDirection: "column"}}>
          <Row style={{justifyContent: "space-between"}}>
            <div style={{fontSize: 20, fontWeight: 700}}>分析アシスタント</div>
            <Pill tone="ai">文脈：MNT Asia Trading ／ 売上高・売上債権</Pill>
          </Row>
          <div style={{flex: 1, marginTop: 22, position: "relative"}}>
            {f >= T.ask.speakStart ? <div style={{display: "flex", justifyContent: "flex-end"}}>
              <div style={{background: c.aiPanelSoft, padding: "14px 18px", borderRadius: "14px 14px 3px 14px", fontSize: 21, maxWidth: 680, minHeight: 56, lineHeight: 1.6}}>
                {q.shown}<span style={{opacity: q.live ? 0.6 : 0, color: c.aiLine}}>▍</span>
                {q.done ? <div style={{fontSize: 14, color: c.aiMuted, marginTop: 6}}>音声から文字起こし</div> : null}
              </div>
            </div> : null}
            {thinking ? <div style={{marginTop: 22, fontSize: 18, color: c.aiMuted}}>資料を照合しています</div> : null}
            {answered ? <div style={{marginTop: 22, display: "flex", gap: 12}}>
              <span style={{width: 34, height: 34, borderRadius: 17, background: `${c.aiLine}22`, color: c.aiLine, display: "grid", placeItems: "center", fontWeight: 800, flex: "none"}}>AI</span>
              <div style={{flex: 1}}>
                <div style={{fontSize: 20, lineHeight: 1.7, minHeight: 34}}>{intro}</div>
                <Reveal at={T.ask.answer + 44}><div style={{fontSize: 15, color: c.aiMuted, marginTop: 14, fontWeight: 700}}>スコアの背景（参照元つき）</div></Reveal>
                {D.ANSWER_BACKGROUND.map((a, i) => (
                  <Reveal key={i} at={T.ask.answer + 52 + i * 16}>
                    <div style={{display: "grid", gridTemplateColumns: "28px 1fr auto", gap: 10, alignItems: "start", padding: "10px 0", borderBottom: `1px solid ${c.aiLine}22`, fontSize: 19, lineHeight: 1.6}}>
                      <span style={{color: c.aiLine, fontWeight: 700}}>{i + 1}</span><span>{a.text}</span>
                      <span style={{...(i === 3 && cited ? {boxShadow: `0 0 0 2px ${c.aiLine}`} : {}), borderRadius: 6}}><Pill tone="ai">{a.src}</Pill></span>
                    </div>
                  </Reveal>
                ))}
                <Reveal at={T.ask.answer + 124}><div style={{fontSize: 15, color: c.aiMuted, marginTop: 16, fontWeight: 700}}>推測される背景</div></Reveal>
                <Row style={{gap: 10, marginTop: 8, flexWrap: "wrap"}}>
                  {D.HYPOTHESES.map((h, i) => <Reveal key={h.name} at={T.ask.answer + 130 + i * 8}><span style={{display: "inline-block", padding: "10px 14px", fontSize: 18, background: c.aiPanelSoft, borderRadius: 8}}>{h.name}　<Pill tone={h.conf === "高" ? "high" : "mid"}>確からしさ {h.conf}</Pill></span></Reveal>)}
                </Row>
                <div style={{marginTop: 18, fontSize: 19, lineHeight: 1.7, minHeight: 32}}>{closing}</div>
              </div>
            </div> : null}
            <TouchRing at={T.ask.cite} x={1030} y={436} />
          </div>
          <div style={{marginTop: 10}}>
            <Row style={{justifyContent: "space-between", fontSize: 15, color: c.aiMuted}}>
              <span>{f < T.ask.speakEnd ? "聞いています" : thinking ? "考えています" : f < T.ask.close + 40 ? "回答中" : "完了"}</span>
              <span>話しかけるか、タップして入力</span>
            </Row>
            <BreathLine phases={[[0, "listen"], [T.ask.speakEnd, "think"], [T.ask.answer, "answer"], [T.ask.close + 40, "done"]]} style={{marginTop: 4}} />
          </div>
        </div>
        <div style={{width: 520, position: "relative"}}>
          <Panel title={f < T.ask.speakEnd ? "参照候補（聞き取りに合わせて準備）" : "参照した資料"} style={{marginBottom: 18}}>
            {PRE.map((s, i) => {
              const at = T.ask.speakStart + s.at;
              if (f < at) return null;
              const st = f < T.ask.speakEnd ? "準備中" : f < T.ask.answer + i * 4 ? "参照中" : "参照済";
              return (
                <Reveal key={s.name} at={at}>
                  <Row style={{justifyContent: "space-between", padding: "10px 4px", borderBottom: `1px solid ${c.line}`, fontSize: 18}}>
                    <span>{s.name}</span><Pill tone={st === "参照済" ? "green" : "teal"}>{st}</Pill>
                  </Row>
                </Reveal>
              );
            })}
            {f < T.ask.speakStart + PRE[0].at ? <div style={{height: 120, display: "grid", placeItems: "center", color: c.muted, fontSize: 16}}>投入済みの資料 12件から、質問に関係するものを並べます。</div> : null}
          </Panel>
          {cited ? <div style={{...panel, padding: "20px 24px", opacity: slide, transform: `translateX(${(1 - slide) * 60}px)`}}>
            <Row style={{justifyContent: "space-between", marginBottom: 10}}><div style={{fontSize: 20, fontWeight: 700, color: c.navy}}>販売契約書 p.7（該当箇所）</div><Pill tone="teal">原本を表示</Pill></Row>
            <div style={{fontSize: 16, lineHeight: 1.8, color: c.muted}}>第12条（売上計上）<br />
              <span style={{background: c.tealSoft, color: c.text, padding: "2px 4px"}}>甲は、乙による書面の検収をもって売上を計上する。</span>検収は納品後10営業日以内に行うものとし、検収書の交付をもって完了とする。</div>
            <div style={{marginTop: 12, fontSize: 15, color: c.muted}}>AIが読んだ範囲：全42ページ ／ 関連箇所 3件</div>
          </div> : null}
        </div>
      </Row>
    </AppShell>
  );
};
