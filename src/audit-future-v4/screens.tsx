import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from "remotion";
import {AppShell, Button, H, Kpi, Panel, Pill, Reveal, Row, Score, c, panel, aiPanel} from "./ui";
import {BreathLine, TouchRing, clamp, useTranscript, useTyped} from "./anim";
import {GroupGrid, ScoreLegend} from "./group";
import * as D from "./data";
import {T} from "./timing";

/* 1. トップ：グループ各社の不正リスクスコア（グラフなし、会社のタイルだけ）→ 会社のタイルにタッチ → 「AIに説明を求める」にタッチ（P1 の机上画面に合成） */
export const ScreenTop: React.FC = () => {
  const f = useCurrentFrame();
  const tap1 = f >= T.top.tap1, tap2 = f >= T.top.tap2;
  const leave = interpolate(f, [T.top.tap2 + 12, T.top.tap2 + 44], [0, 1], clamp);
  const pop = {left: 612, top: 592, width: 340, height: 130};
  return (
    <AbsoluteFill>
    <AppShell active={0} crumbs={["ダッシュボード", "グループ各社の不正リスクスコア"]}>
      <div style={{opacity: 1 - leave, transform: `scale(${1 - leave * 0.02})`, transformOrigin: "50% 50%", height: "100%", position: "relative"}}>
        <Row style={{justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16}}>
          <H sub="過去の不正事例を学習した機械学習モデルによる確認優先度（0〜100）。不正の確率ではありません。">グループ各社の不正リスクスコア</H>
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
              <span style={{color: c.high, fontWeight: 700}}>MNT Asia Trading</span> が +33 で要確認。会社を選ぶと、根拠を説明します。
            </div>
            <BreathLine phases={[[0, "done"]]} style={{marginTop: 4}} />
          </div>
        </Row>
        <div style={{position: "absolute", left: 0, top: 236}}>
          <GroupGrid ring={tap1 ? D.TARGET.name : undefined} ringStrong={tap2} />
        </div>
        <Row style={{position: "absolute", left: 0, right: 0, top: 744, ...panel, padding: "14px 20px", fontSize: 15, color: c.muted, lineHeight: 1.7, justifyContent: "space-between"}}>
          <span><b style={{color: c.navy, marginRight: 12}}>{D.MODEL.title}</b>{D.MODEL.lines[0]}　{D.MODEL.lines[1]}</span>
          <ScoreLegend />
        </Row>
        {tap1 ? <div style={{position: "absolute", ...pop, ...panel, padding: "14px 18px", boxSizing: "border-box",
          boxShadow: "0 12px 36px #0b1a2e22", border: `1px solid ${tap2 ? c.teal : c.line}`, opacity: interpolate(f, [T.top.tap1, T.top.tap1 + 8], [0, 1], clamp)}}>
          <Row style={{justifyContent: "space-between"}}>
            <span><b style={{fontSize: 18}}>{D.TARGET.name}</b></span>
            <span><Score v={87} size={22} />　<span style={{color: c.muted, fontSize: 14}}>前月 54 ／ +33</span></span>
          </Row>
          <div style={{marginTop: 4, color: c.muted, fontSize: 14}}>{D.TARGET.region}　要確認</div>
          <div style={{position: "absolute", left: 18, top: 66}}>
            <Button primary pressed={tap2} style={{padding: "9px 18px", fontSize: 16}}>AIに説明を求める</Button>
          </div>
          <div style={{position: "absolute", right: 18, top: 76, fontSize: 13, color: c.muted}}>{tap2 ? "説明を準備しています" : "詳細を開く"}</div>
        </div> : null}
        <TouchRing at={T.top.tap1} x={T.top.p1[0]} y={T.top.p1[1]} />
        <TouchRing at={T.top.tap2} x={T.top.p2[0]} y={T.top.p2[1]} />
      </div>
    </AppShell>
    {/* The explanation opens in place; the next full-screen cut continues it (cut offset = 192 - this start). */}
    <Sequence from={T.top.tap2 + 40}><ScreenExplain /></Sequence>
    </AbsoluteFill>
  );
};

/* 2. AIによるスコアの説明（232フレーム）：会社の概要とモデルの説明 → AIが根拠を3点、文章で説明 → 聞き取り待ちへ。グラフは出さない。 */
const E = {intro: 22, reasons: [64, 96, 128], close: 160, listen: 196};
export const ScreenExplain: React.FC = () => {
  const f = useCurrentFrame();
  const intro = useTyped("スコア 87 は、学習した不正事例と共通する兆候が3つ重なっていることによります。", E.intro, 22);
  const closing = useTyped("前月からの上昇 +33 は、主に 1 と 3 によるものです。詳しく聞きたい点を話しかけてください。", E.close, 22);
  const listening = f >= E.listen;
  return (
    <AppShell active={2} crumbs={["子会社一覧", D.TARGET.name, "スコアの説明"]}>
      <Row style={{justifyContent: "space-between", marginBottom: 16}}>
        <div style={{fontSize: 30, fontWeight: 700, color: c.navy}}>{D.TARGET.name} <span style={{fontSize: 18, color: c.muted, fontWeight: 400, marginLeft: 10}}>{D.TARGET.region}</span></div>
        <Row style={{gap: 26}}>
          <div><div style={{fontSize: 15, color: c.muted}}>不正リスクスコア</div><Score v={D.TARGET.score} size={40} /></div>
          <div><div style={{fontSize: 15, color: c.muted}}>前月</div><div style={{fontSize: 28, fontWeight: 700}}>{D.TARGET.prev} <span style={{color: c.high, fontSize: 20}}>▲33</span></div></div>
          <Pill tone="high">要確認</Pill>
        </Row>
      </Row>
      <Row style={{gap: 18, alignItems: "stretch", height: 860}}>
        <div style={{flex: 0.85, display: "flex", flexDirection: "column", gap: 18}}>
          <Panel title="会社の概要">
            {D.PROFILE.map(([k, v], i) => (
              <Reveal key={k} at={4 + i * 5}>
                <div style={{display: "grid", gridTemplateColumns: "150px 1fr", padding: "10px 4px", borderBottom: `1px solid ${c.line}`, fontSize: 17, lineHeight: 1.5}}>
                  <span style={{color: c.muted}}>{k}</span><span>{v}</span>
                </div>
              </Reveal>
            ))}
          </Panel>
          <Panel title={D.MODEL.title} right={<Pill tone="teal">機械学習</Pill>} style={{flex: 1}}>
            {D.MODEL.lines.map((l, i) => (
              <Reveal key={i} at={30 + i * 8}>
                <div style={{fontSize: 17, lineHeight: 1.75, padding: "8px 4px", borderBottom: i < 2 ? `1px solid ${c.line}` : "none"}}>{l}</div>
              </Reveal>
            ))}
            <Reveal at={60}><div style={{marginTop: 14, fontSize: 15, color: c.muted, lineHeight: 1.6}}>説明は、モデルが注目した兆候を投入済みの資料と照らして文章で示します。スコアの内訳の数値そのものは判断材料にしません。</div></Reveal>
          </Panel>
        </div>
        <div style={{flex: 1.5, ...aiPanel, padding: "22px 28px", position: "relative", display: "flex", flexDirection: "column"}}>
          <Row style={{justifyContent: "space-between"}}>
            <div style={{fontSize: 20, fontWeight: 700}}>分析アシスタント</div>
            <Pill tone="ai">スコアの説明：{D.TARGET.name}</Pill>
          </Row>
          <div style={{flex: 1, marginTop: 20}}>
            <div style={{display: "flex", gap: 12}}>
              <span style={{width: 34, height: 34, borderRadius: 17, background: `${c.aiLine}22`, color: c.aiLine, display: "grid", placeItems: "center", fontWeight: 800, flex: "none"}}>AI</span>
              <div style={{flex: 1}}>
                {f < E.intro ? <div style={{fontSize: 18, color: c.aiMuted, minHeight: 34}}>スコアの根拠を整理しています</div> : <div style={{fontSize: 21, lineHeight: 1.7, minHeight: 34}}>{intro}</div>}
                <Reveal at={E.reasons[0] - 10}><div style={{fontSize: 15, color: c.aiMuted, marginTop: 16, fontWeight: 700}}>モデルが注目した兆候</div></Reveal>
                {D.EXPLAIN.map((a, i) => (
                  <Reveal key={i} at={E.reasons[i]}>
                    <div style={{display: "grid", gridTemplateColumns: "34px 1fr auto", gap: 12, alignItems: "start", padding: "14px 0", borderBottom: `1px solid ${c.aiLine}22`, fontSize: 20, lineHeight: 1.65}}>
                      <span style={{width: 28, height: 28, borderRadius: 14, border: `1px solid ${c.aiLine}`, color: c.aiLine, display: "grid", placeItems: "center", fontSize: 15, marginTop: 3}}>{i + 1}</span>
                      <span>{a.text}<div style={{fontSize: 14, color: c.aiMuted, marginTop: 4}}>参照：{a.src}</div></span>
                      <Pill tone={a.match === "高" ? "high" : "mid"}>学習事例との一致 {a.match}</Pill>
                    </div>
                  </Reveal>
                ))}
                <div style={{marginTop: 18, fontSize: 20, lineHeight: 1.7, minHeight: 32}}>{closing}</div>
                <Reveal at={E.close + 50}><div style={{fontSize: 15, color: c.aiMuted, marginTop: 22, fontWeight: 700}}>たとえば、こんな質問ができます</div></Reveal>
                <Row style={{gap: 10, marginTop: 10, flexWrap: "wrap"}}>
                  {["計上時点のずれを、契約条件と合わせて", "与信枠が広がった経緯", "学習した類似事例との違い"].map((s, i) => (
                    <Reveal key={s} at={E.close + 56 + i * 8}><span style={{display: "inline-block", padding: "10px 16px", fontSize: 17, background: c.aiPanelSoft, borderRadius: 20, border: `1px solid ${c.aiLine}33`}}>{s}</span></Reveal>
                  ))}
                </Row>
              </div>
            </div>
          </div>
          <div style={{marginTop: 10}}>
            <Row style={{justifyContent: "space-between", fontSize: 15, color: c.aiMuted}}>
              <span>{f < E.intro ? "考えています" : listening ? "聞いています" : "回答中"}</span>
              <span>話しかけるか、タップして入力</span>
            </Row>
            <BreathLine phases={[[0, "think"], [E.intro, "answer"], [E.close + 60, "done"], [E.listen, "listen"]]} style={{marginTop: 4}} />
          </div>
        </div>
      </Row>
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
  const intro = useTyped("販売契約、売上明細、検収記録を照合し、計上時点のずれの背景を整理しました。", T.ask.answer, 22);
  const cited = f >= T.ask.cite;
  const slide = interpolate(f, [T.ask.cite + 4, T.ask.cite + 20], [0, 1], clamp);
  const closing = useTyped("次に、確認すべき論点と追加の確認事項を整理します。", T.ask.close, 22);
  return (
    <AppShell active={2} crumbs={["スコア分析", D.TARGET.name, "AIとの対話"]}>
      <Row style={{gap: 18, alignItems: "stretch", height: "100%"}}>
        <div style={{flex: 1, ...aiPanel, padding: "22px 28px", position: "relative", display: "flex", flexDirection: "column"}}>
          <Row style={{justifyContent: "space-between"}}>
            <div style={{fontSize: 20, fontWeight: 700}}>分析アシスタント</div>
            <Pill tone="ai">文脈：MNT Asia Trading ／ スコア 87 の説明から続き</Pill>
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
                <Reveal at={T.ask.answer + 44}><div style={{fontSize: 15, color: c.aiMuted, marginTop: 14, fontWeight: 700}}>背景（参照元つき）</div></Reveal>
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
