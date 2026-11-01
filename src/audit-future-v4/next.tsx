import {useCurrentFrame} from "remotion";
import {AppShell, H, Kpi, Pill, Reveal, Row, Score, c, panel} from "./ui";
import {BreathLine, useT} from "./anim";
import {aiPanel} from "./ui";
import * as D from "./data";
import {GRID_H, GRID_W, GroupGrid} from "./group";


const NEXT = [
  {name: "Orbis Labs", biz: "ソフトウェア（新規連結）", score: 74, prev: 71, hit: true},
  {name: "MNT Asia Trading", biz: "販売（海外）", score: 71, prev: 87, done: true},
  {name: "北関東精機", biz: "製造（国内）", score: 58, prev: 58},
  {name: "ミナトロジスティクス", biz: "物流（国内）", score: 46, prev: 46},
  {name: "MNT Europe GmbH", biz: "販売（海外）", score: 41, prev: 41},
  {name: "ミナトサービス", biz: "保守サービス", score: 33, prev: 33},
];


/* 翌朝：手続結果を反映したダッシュボードと、蓄積された判断履歴 */
export const ScreenNext: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT(20, 40); // 87 -> 71 のスコア更新
  return (
    <AppShell active={0} crumbs={["ダッシュボード", "子会社リスクスコア"]}>
      <H sub="過去の不正事例を学習した機械学習モデルによる確認優先度（0〜100）。不正の確率ではありません。">グループ各社の不正リスクスコア</H>
      <Row style={{gap: 16, marginBottom: 18}}>
        <Kpi label="対象子会社" value="20社" note="連結子会社" />
        <Kpi label="スコア 75以上" value={t > 0.6 ? "0社" : "1社"} note={t > 0.6 ? "追加手続を反映" : "MNT Asia Trading"} tone={t > 0.6 ? "neutral" : "high"} />
        <div style={{...aiPanel, padding: "14px 20px", flex: 2.1}}>
          <Row style={{justifyContent: "space-between"}}><span style={{fontSize: 15, color: c.aiMuted}}>夜間のAI作業　06:10 完了</span><Pill tone="ai">判断履歴 3件を学習に反映</Pill></Row>
          <div style={{fontSize: 16, lineHeight: 1.65, marginTop: 6}}>確認状回答・検収書・回収状況を取り込み、20社を再分析しました。MNT Asia Trading は 87 → 71。昨日の判断理由を類似案件の参照知識に追加しました。</div>
          <BreathLine phases={[[0, "done"]]} style={{marginTop: 4}} />
        </div>
      </Row>
      <Row style={{gap: 18, alignItems: "stretch"}}>
        <div style={{...panel, padding: "20px 24px", flex: 1.35, position: "relative", alignSelf: "flex-start"}}>
          <Row style={{justifyContent: "space-between", marginBottom: 14}}><div style={{fontSize: 21, fontWeight: 700, color: c.navy}}>グループ各社の不正リスクスコア</div><Pill tone="teal">10月27日 06:10 更新</Pill></Row>
          <div style={{width: GRID_W * 0.56, height: GRID_H * 0.56, position: "relative"}}>
            <div style={{position: "absolute", left: 0, top: 0, transform: "scale(0.56)", transformOrigin: "0 0"}}>
              <GroupGrid scoreOf={(k) => k.name === "MNT Asia Trading" ? Math.round(87 - 16 * t) : k.name === "Orbis Labs" ? Math.round(71 + 3 * t) : k.score}
                deltaOf={(k) => k.name === "MNT Asia Trading" ? -Math.round(16 * t) : k.name === "Orbis Labs" ? Math.round(3 * t) : 0}
                ring={t > 0.9 ? "MNT Asia Trading" : undefined}
                tagOf={(k) => k.name === "MNT Asia Trading" && t > 0.9 ? <Pill tone="green">手続反映</Pill> : null} />
            </div>
          </div>
          <div style={{marginTop: 12, fontSize: 15, color: c.muted}}>{D.MODEL.lines[0]}</div>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 18, flex: 1}}>
          <div style={{...panel, padding: "20px 24px"}}>
            <Row style={{justifyContent: "space-between", marginBottom: 12}}><div style={{fontSize: 21, fontWeight: 700, color: c.navy}}>スコア上位の子会社</div><span style={{fontSize: 16, color: c.muted}}>前日比</span></Row>
            {NEXT.map((k, i) => {
              const score = k.done ? Math.round(87 - (87 - 71) * t) : k.hit ? Math.round(71 + 3 * t) : k.score;
              return (
                <div key={k.name} style={{display: "grid", gridTemplateColumns: "1fr 170px 70px 80px", alignItems: "center", padding: "11px 10px", fontSize: 19, borderRadius: 8, marginBottom: 4,
                  background: k.hit && t > 0.8 ? c.amberSoft : "transparent", border: k.hit && t > 0.8 ? `1px solid ${c.high}` : "1px solid transparent"}}>
                  <span style={{fontWeight: k.hit || k.done ? 700 : 500}}>{k.name} {k.done && t > 0.9 ? <Pill tone="green">手続反映</Pill> : null}</span>
                  <span style={{color: c.muted, fontSize: 16}}>{k.biz}</span>
                  <span style={{textAlign: "right"}}><Score v={score} size={22} /></span>
                  <span style={{textAlign: "right", fontSize: 16, color: k.done ? c.green : k.hit ? c.high : c.muted}}>{k.done ? `−${Math.round(16 * t)}` : k.hit ? `+${Math.round(3 * t)}` : "±0"}</span>
                </div>
              );
            })}
          </div>
          <Reveal at={96}>
            <div style={{...panel, padding: "20px 24px"}}>
              <Row style={{justifyContent: "space-between", marginBottom: 10}}><div style={{fontSize: 21, fontWeight: 700, color: c.navy}}>判断履歴（AIの参照知識に追加）</div><Pill tone="teal">3件</Pill></Row>
              {[["10月26日", "MNT Asia Trading ／ 売上高・売上債権", "収益認識の時点を重点領域に設定（主査）"], ["10月26日", "追加手続 4件を承認（パートナー）", "確認状・検収書突合・契約閲覧・インタビュー"], ["10月27日", "確認状回答 3社を反映", "スコア 87 → 71、論点1を継続確認"]].map((r, i) => (
                <Reveal key={i} at={104 + i * 14}>
                  <div style={{display: "grid", gridTemplateColumns: "90px 1fr", gap: 10, padding: "8px 0", borderBottom: `1px solid ${c.line}`, fontSize: 17, lineHeight: 1.55}}>
                    <span style={{color: c.muted}}>{r[0]}</span><span><b>{r[1]}</b><br /><span style={{color: c.muted}}>{r[2]}</span></span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </Row>
      {f < 0 ? null : null}
    </AppShell>
  );
};
