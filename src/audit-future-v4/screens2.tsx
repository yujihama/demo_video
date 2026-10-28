import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {AppShell, Button, H, Panel, Pill, Presence, Reveal, Row, c, font, panel, aiPanel} from "./ui";
import {BreathLine, GrowBar, TouchRing, clamp} from "./anim";
import * as D from "./data";
import {T} from "./timing";

/* 4. 論点管理：AIが分析計画を提示 → 監査人が「実行」にタッチ → 3つのエージェントが並列に進み、クライアント確認事項に合流 */
const PLAN = ["スコアの再分析（売上高・売上債権）", "契約書・議事録・入金明細の探索", "期末後入金と売上明細の突合", "同業・グループ内子会社との比較", "確認事項の整理"];
const AGENTS = [
  {name: "売上・収益認識", steps: ["売上明細 1,284件を読込", "最終週の計上 312件を抽出", "検収日との差を算定：平均17日"], len: 60},
  {name: "与信・回収", steps: ["与信管理台帳を照合", "限度超過 2社を特定", "期末後入金 未達率 62%"], len: 72},
  {name: "資料探索", steps: ["資料 12件を走査", "関連箇所 7件をハイライト", "返品条項の有無を確認中"], len: 84},
];

export const ScreenIssues: React.FC = () => {
  const f = useCurrentFrame();
  const run = f >= T.issues.run;
  const merged = f >= T.issues.run + 96;
  return (
    <AppShell active={4} crumbs={["論点管理", D.TARGET.name, "売上高・売上債権"]}>
      <H sub="対話から論点を整理し、AIが計画を示して監査人の実行指示を待ちます。">確認すべき論点と自律分析</H>
      <Row style={{gap: 18, alignItems: "stretch"}}>
        <Panel title="確認すべき論点" style={{flex: 0.9}}>
          {D.ISSUES.map((k, i) => (
            <Reveal key={k.name} at={2 + i * 8}>
              <div style={{padding: "14px 12px", borderRadius: 10, background: i === 0 ? c.amberSoft : "#f7f9fb", marginBottom: 10}}>
                <div style={{fontSize: 20, fontWeight: 700}}>{i + 1}. {k.name}</div>
                <div style={{fontSize: 16, color: c.muted, marginTop: 4}}>{k.detail}</div>
              </div>
            </Reveal>
          ))}
          <Reveal at={30}><div style={{fontSize: 15, color: c.muted, marginTop: 6}}>対話の内容から整理。論点は監査人が追加・修正できます。</div></Reveal>
        </Panel>
        <div style={{flex: 1.5, ...aiPanel, padding: "20px 24px", position: "relative"}}>
          <Row style={{justifyContent: "space-between", marginBottom: 12}}>
            <div style={{fontSize: 20, fontWeight: 700}}>{run ? "自律分析の進行" : "分析計画（実行前）"}</div>
            {run ? <Pill tone="ai">{merged ? "完了" : "3エージェント 並列実行中"}</Pill> : <Button primary pressed={f >= T.issues.run - 2} style={{padding: "8px 18px", fontSize: 16}}>実行</Button>}
          </Row>
          {!run ? <>
            {PLAN.map((s, i) => (
              <Reveal key={s} at={8 + i * 6}>
                <Row style={{gap: 12, padding: "10px 4px", borderBottom: `1px solid ${c.aiLine}1e`, fontSize: 18}}>
                  <span style={{width: 26, height: 26, borderRadius: 13, border: `1px solid ${c.aiLine}`, color: c.aiLine, display: "grid", placeItems: "center", fontSize: 14}}>{i + 1}</span>{s}
                </Row>
              </Reveal>
            ))}
            <Reveal at={40}><div style={{fontSize: 15, color: c.aiMuted, marginTop: 12}}>手順は入れ替えや削除ができます。実行すると結果が論点に紐づきます。</div></Reveal>
            <TouchRing at={T.issues.run - 4} x={1010} y={12} />
          </> : <>
            <Row style={{gap: 14, alignItems: "stretch"}}>
              {AGENTS.map((a, i) => {
                const p = interpolate(f, [T.issues.run + 4 + i * 6, T.issues.run + 4 + i * 6 + a.len], [0, 1], clamp);
                return (
                  <div key={a.name} style={{flex: 1, background: c.aiPanelSoft, borderRadius: 10, padding: "12px 14px"}}>
                    <Row style={{justifyContent: "space-between"}}><span style={{fontSize: 16, fontWeight: 700}}>{a.name}</span><span style={{fontSize: 14, color: c.aiMuted}}>{Math.round(p * 100)}%</span></Row>
                    <div style={{height: 3, background: `${c.aiLine}22`, borderRadius: 2, margin: "8px 0 10px"}}><div style={{width: `${p * 100}%`, height: "100%", background: c.aiLine, boxShadow: `0 0 8px ${c.aiLine}`}} /></div>
                    {a.steps.map((s, j) => {
                      const on = p >= (j + 1) / a.steps.length - 0.01, cur = !on && p >= j / a.steps.length;
                      return <div key={s} style={{fontSize: 15, lineHeight: 1.7, color: on ? c.aiText : cur ? c.aiLine : `${c.aiMuted}88`}}>{on ? "✓ " : cur ? "› " : "· "}{s}</div>;
                    })}
                  </div>
                );
              })}
            </Row>
            <BreathLine phases={[[T.issues.run, "think"], [T.issues.run + 96, "done"]]} style={{marginTop: 10}} />
            {merged ? <Reveal at={T.issues.run + 96}><div style={{marginTop: 6, fontSize: 17, lineHeight: 1.7}}>3つの結果を統合しました。探索した資料 12件のうち、論点に関係する箇所 7件をハイライトしています。</div></Reveal> : null}
          </>}
        </div>
        <Panel title="クライアントへの確認事項" right={merged ? <Button style={{padding: "8px 16px", fontSize: 16}}>確認依頼を作成</Button> : <Pill>分析完了後に整理</Pill>} style={{flex: 1}}>
          {merged ? D.CLIENT_ASKS.map((s, i) => (
            <Reveal key={s} at={T.issues.run + 100 + i * 10}>
              <Row style={{alignItems: "flex-start", gap: 12, padding: "12px 4px", borderBottom: `1px solid ${c.line}`, fontSize: 18, lineHeight: 1.6}}>
                <span style={{width: 22, height: 22, border: `2px solid ${c.teal}`, borderRadius: 6, flex: "none", marginTop: 4}} /><span>{s}</span>
              </Row>
            </Reveal>
          )) : <div style={{height: 300, display: "grid", placeItems: "center", color: c.muted, fontSize: 16, textAlign: "center", lineHeight: 1.7}}>分析の結果から、<br />会社に確認すべき事項を整理します。</div>}
          {merged ? <Reveal at={T.issues.run + 134}><div style={{marginTop: 14, fontSize: 15, color: c.muted}}>受領した資料は手元のタブレットから投入できます。</div></Reveal> : null}
        </Panel>
      </Row>
    </AppShell>
  );
};

/* 5a. タブレット（4:3、P3 の机上タブレットに合成）：受領資料のカードを上へスワイプして大画面へ送る */
export const ScreenTablet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: "#0f1626", fontFamily: font, color: c.aiText, padding: 56}}>
      <Row style={{justifyContent: "space-between"}}>
        <div><div style={{fontSize: 22, color: c.aiMuted, letterSpacing: 2}}>受領資料</div><div style={{fontSize: 40, fontWeight: 700, marginTop: 4}}>MNT Asia Trading</div></div>
        <Pill tone="ai">上へスワイプで分析に投入</Pill>
      </Row>
      <div style={{marginTop: 150, display: "flex", flexDirection: "column", gap: 24}}>
        {D.RECEIVED.map((r, i) => {
          const s = T.tablet.swipes[i];
          const t = interpolate(f, [s, s + 14], [0, 1], clamp);
          const gone = f >= s + 14;
          if (gone) return null;
          return (
            <div key={r.name} style={{opacity: 1 - t * 0.6, transform: `translateY(${-t * 900}px) scale(${1 - t * 0.1})`,
              background: "#1a2540", borderRadius: 18, padding: "28px 32px", fontSize: 32, display: "flex", justifyContent: "space-between", alignItems: "center",
              border: `1px solid ${c.aiLine}2e`}}>
              <span>{r.name}</span><span style={{fontSize: 22, color: c.aiMuted}}>{["PDF 2.1MB", "PDF 0.8MB", "XLSX 0.3MB"][i]}</span>
            </div>
          );
        })}
      </div>
      <div style={{position: "absolute", left: 56, right: 56, bottom: 56}}>
        <Row style={{justifyContent: "space-between", fontSize: 22, color: c.aiMuted}}><span>投入済み {T.tablet.swipes.filter((s) => f >= s + 14).length} ／ 3</span><span>大画面と同期中</span></Row>
        <BreathLine phases={[[0, "done"], [T.tablet.swipes[0], "think"], [T.tablet.swipes[2] + 14, "done"]]} style={{marginTop: 8}} />
      </div>
      {T.tablet.swipes.map((s, i) => <TouchRing key={i} at={s - 2} x={T.tablet.tips[i][0]} y={T.tablet.tips[i][1]} hold={6} />)}
    </AbsoluteFill>
  );
};

/* 5b. 深掘り（384フレーム）：前半 P3 の大画面に合成（カードが下端から届く）、後半 S5 のフル画面（更新分析・同業比較・経営指標） */
export const ScreenDeepen: React.FC = () => {
  const f = useCurrentFrame();
  const maxDays = 120;
  const arrived = T.deepen.arrive.filter((a) => f >= a + 14).length;
  const all = arrived === 3;
  const analyze = T.deepen.arrive[2] + 20;
  const updated = f >= analyze + 48;
  return (
    <AppShell active={3} crumbs={["資料・データ", D.TARGET.name, "追加資料の投入"]}>
      <H sub="受領した資料を投入すると、AIがそれを踏まえて分析を更新します。">追加資料を踏まえた深掘り</H>
      <Row style={{gap: 18, alignItems: "flex-start"}}>
        <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 18}}>
          <Panel title="受領資料の投入" right={<Pill tone={all ? "green" : "teal"}>{all ? "3件 取込済" : `タブレットから受信中 ${arrived}／3`}</Pill>} style={{position: "relative", overflow: "hidden", minHeight: 300}}>
            {D.RECEIVED.map((r, i) => {
              const a = T.deepen.arrive[i];
              if (f < a) return null;
              const t = interpolate(f, [a, a + 14], [0, 1], {...clamp});
              return (
                <div key={r.name} style={{opacity: t, transform: `translateY(${(1 - t) * 260}px)`}}>
                  <Row style={{justifyContent: "space-between", padding: "10px 6px", borderBottom: `1px solid ${c.line}`, fontSize: 18}}>
                    <span>{r.name}</span><Pill tone={f >= a + 30 ? "green" : "teal"}>{f >= a + 30 ? "取込済" : "読込中"}</Pill>
                  </Row>
                </div>
              );
            })}
            {!all ? <div style={{position: "absolute", left: 24, right: 24, bottom: 20, border: `2px dashed ${c.teal}`, borderRadius: 10, padding: 16, textAlign: "center", color: c.teal, fontSize: 16, background: c.tealSoft}}>手元のタブレットから受け付けています</div> : null}
          </Panel>
          <div style={{...aiPanel, padding: "20px 24px"}}>
            <Row style={{justifyContent: "space-between", marginBottom: 10}}><div style={{fontSize: 20, fontWeight: 700}}>更新された分析</div>{updated ? <Pill tone="ai">10月26日 09:40 更新</Pill> : <Pill tone="ai">{all ? "分析を更新中" : "資料を待機"}</Pill>}</Row>
            {updated ? D.UPDATED_FINDINGS.map((fi, i) => <Reveal key={i} at={analyze + 48 + i * 14}><div style={{display: "grid", gridTemplateColumns: "26px 1fr", gap: 8, padding: "9px 0", fontSize: 18, lineHeight: 1.65}}><span style={{color: c.aiLine, fontWeight: 700}}>{i + 1}</span><span>{fi}</span></div></Reveal>)
              : <div style={{height: 110, display: "grid", placeItems: "center", color: c.aiMuted, fontSize: 16}}>{all ? "投入された資料を読み込み、論点と照合しています" : "3件の資料が届くと、論点と照合して分析を更新します"}</div>}
            <BreathLine phases={[[0, "done"], [T.deepen.arrive[0], "think"], [analyze + 48, "answer"], [analyze + 100, "done"]]} style={{marginTop: 8}} />
          </div>
        </div>
        <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 18}}>
          <Panel title="同業比較：売上債権回転日数">
            {D.PEERS.map((p, i) => (
              <div key={p.name} style={{display: "grid", gridTemplateColumns: "250px 1fr 70px", alignItems: "center", gap: 14, padding: "10px 0", fontSize: 18}}>
                <span style={{fontWeight: p.hit ? 700 : 500}}>{p.name}</span>
                <GrowBar pct={(p.days / maxDays) * 100} color={p.hit ? c.high : c.low} start={updated ? analyze + 60 + i * 8 : 1e6} />
                <b style={{textAlign: "right", color: p.hit ? c.high : c.navy, opacity: f >= analyze + 76 + i * 8 ? 1 : 0}}>{p.days}日</b>
              </div>
            ))}
            <div style={{fontSize: 15, color: c.muted, marginTop: 6}}>同業データ：外部データベース（東南アジア 販売会社 42社）</div>
          </Panel>
          <Panel title="経営指標との整合" style={{flex: 1}}>
            <Row style={{gap: 14}}>
              {D.METRICS.map((m, i) => <Reveal key={m.name} at={analyze + 90 + i * 8} style={{flex: 1}}><div style={{background: "#f7f9fb", borderRadius: 10, padding: "12px 14px"}}><div style={{fontSize: 15, color: c.muted}}>{m.name}</div><div style={{fontSize: 28, fontWeight: 800, color: c.navy}}>{m.value}</div><div style={{fontSize: 15, color: c.muted}}>{m.ref}</div></div></Reveal>)}
            </Row>
            {f >= analyze + 120 ? <Reveal at={analyze + 120}><div style={{marginTop: 14, padding: "14px 16px", ...aiPanel, fontSize: 18, lineHeight: 1.65}}>
              <b style={{color: c.aiLine}}>AIの示唆：</b>売上の伸びに対して営業キャッシュフローが減少しており、回転日数の長期化と整合します。収益認識の時点を重点的に確認することを推奨します。
            </div></Reveal> : null}
            {f >= analyze + 150 ? <Reveal at={analyze + 150}><div style={{marginTop: 12, padding: "12px 16px", background: "#f7f9fb", borderRadius: 10, fontSize: 16, lineHeight: 1.6, color: c.muted}}>
              <b style={{color: c.navy}}>仮に：</b>与信規程の例外承認が運用されていた場合、モデルは本区分の寄与を 38pt → 24pt と見積もります（反実仮想）。
            </div></Reveal> : null}
          </Panel>
        </div>
      </Row>
    </AppShell>
  );
};

/* 6. 壁面（P4 に合成）：タブレットから壁面へ共有 → 更新分析と同業比較を大きく → 右端にAI議事メモが積み上がる */
const MINUTES = ["09:52 共有：MNT Asia Trading 深掘り結果（田中）", "09:53 論点1 収益認識の時点：検収前計上の可能性を確認", "09:54 佐藤：返品条項の範囲を契約3社すべてで確認したい", "09:55 山本：追加手続の工数見積りを本日中に", "09:56 決定：確認状と検収書突合を優先、インタビューは来週"];

export const ScreenWall: React.FC = () => {
  const f = useCurrentFrame();
  const shared = f >= T.wall.share;
  const t = interpolate(f, [T.wall.share, T.wall.share + 16], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: "#0f1626", fontFamily: font, color: c.aiText}}>
      {!shared ? <AbsoluteFill style={{display: "grid", placeItems: "center"}}>
        <div style={{textAlign: "center"}}>
          <div style={{fontSize: 28, color: c.aiMuted, letterSpacing: 4}}>チームルーム B</div>
          <div style={{fontSize: 22, color: `${c.aiMuted}99`, marginTop: 14}}>タブレットを向けて共有</div>
          <BreathLine phases={[[0, "done"]]} style={{marginTop: 30}} width={600} />
        </div>
      </AbsoluteFill> : null}
      {shared ? <div style={{position: "absolute", inset: 0, opacity: t, transform: `scale(${0.96 + 0.04 * t})`, display: "flex"}}>
        <div style={{flex: 1, padding: "40px 48px"}}>
          <Row style={{justifyContent: "space-between"}}>
            <div><div style={{fontSize: 20, color: c.aiMuted}}>田中のタブレットから共有</div><div style={{fontSize: 40, fontWeight: 700, marginTop: 4}}>MNT Asia Trading　追加資料を踏まえた深掘り</div></div>
            <Presence names={["田", "佐", "山"]} live={3} />
          </Row>
          <Row style={{gap: 24, marginTop: 30, alignItems: "stretch"}}>
            <div style={{flex: 1.2, background: "#172038", borderRadius: 14, padding: "26px 30px"}}>
              <div style={{fontSize: 22, color: c.aiMuted, marginBottom: 14}}>更新された分析</div>
              {D.UPDATED_FINDINGS.map((fi, i) => <Reveal key={i} at={T.wall.share + 16 + i * 10}><div style={{display: "grid", gridTemplateColumns: "34px 1fr", gap: 10, padding: "12px 0", fontSize: 26, lineHeight: 1.6}}><span style={{color: c.aiLine, fontWeight: 700}}>{i + 1}</span><span>{fi}</span></div></Reveal>)}
            </div>
            <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 24}}>
              <div style={{background: "#172038", borderRadius: 14, padding: "26px 30px"}}>
                <div style={{fontSize: 22, color: c.aiMuted, marginBottom: 14}}>同業比較：売上債権回転日数</div>
                {D.PEERS.map((p, i) => (
                  <div key={p.name} style={{display: "grid", gridTemplateColumns: "300px 1fr 90px", alignItems: "center", gap: 14, padding: "10px 0", fontSize: 24}}>
                    <span style={{fontWeight: p.hit ? 700 : 500}}>{p.name}</span>
                    <div style={{height: 14, background: `${c.aiLine}18`, borderRadius: 7, overflow: "hidden"}}><div style={{width: `${(p.days / 120) * 100 * interpolate(f, [T.wall.share + 20 + i * 6, T.wall.share + 38 + i * 6], [0, 1], clamp)}%`, height: "100%", background: p.hit ? c.high : c.aiLine}} /></div>
                    <b style={{textAlign: "right", color: p.hit ? c.high : c.aiText}}>{p.days}日</b>
                  </div>
                ))}
              </div>
              <Reveal at={T.wall.share + 50}><div style={{...aiPanel, padding: "22px 28px", fontSize: 24, lineHeight: 1.6}}><b style={{color: c.aiLine}}>AIの示唆：</b>売上の伸びに対して営業キャッシュフローが減少。収益認識の時点を重点的に確認することを推奨します。</div></Reveal>
            </div>
          </Row>
        </div>
        <div style={{width: 520, background: "#0a101d", padding: "40px 32px", borderLeft: `1px solid ${c.aiLine}22`}}>
          <Row style={{justifyContent: "space-between"}}><span style={{fontSize: 20, fontWeight: 700}}>AI 議事メモ</span><Pill tone="ai">記録中</Pill></Row>
          <BreathLine phases={[[T.wall.share, "listen"]]} style={{marginTop: 10}} />
          <div style={{marginTop: 16}}>
            {MINUTES.map((m, i) => f >= T.wall.share + 24 + i * 22 ? <Reveal key={m} at={T.wall.share + 24 + i * 22}><div style={{fontSize: 18, lineHeight: 1.6, padding: "10px 0", borderBottom: `1px solid ${c.aiLine}18`, color: i === 4 ? c.aiText : c.aiMuted}}>{m}</div></Reveal> : null)}
          </div>
          <div style={{position: "absolute", bottom: 40, fontSize: 15, color: `${c.aiMuted}99`}}>議事メモは会議後に参加者の確認を経て調書に紐づきます。</div>
        </div>
      </div> : null}
    </AbsoluteFill>
  );
};
