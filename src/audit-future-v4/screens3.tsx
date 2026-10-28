import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {AppShell, Button, H, Panel, Pill, Presence, Reveal, Row, c, font, aiPanel, panel} from "./ui";
import {BreathLine, TouchRing, clamp, useTyped} from "./anim";
import * as D from "./data";
import {T} from "./timing";

/* 7. 成果物（384フレーム）：前半 S6 フル画面（追加手続案・調書メモ・会社報告ドラフト → レビュー依頼）、後半 P5 の壁面に合成（パートナーが「承認」にタッチし、判断理由を残す） */
const A0 = 192; // approval half starts here
export const ScreenOutputs: React.FC = () => {
  const f = useCurrentFrame();
  const links = Math.min(4, Math.floor(Math.max(0, f - 30) / 16));
  const review = f >= 170;
  const g = f - A0;
  const tapped = g >= T.approve.tap;
  const reason = useTyped("検収前計上の可能性は資料で裏づけられており、確認状と検収書突合を優先する判断は妥当。", A0 + T.approve.reason, 20);
  const done = g >= T.approve.done;
  const fade = interpolate(g, [-6, 6], [0, 1], clamp);
  return (
    <AppShell active={5} crumbs={["調書", D.TARGET.name, g >= 0 ? "パートナーレビュー" : "成果物のドラフト"]}>
      <div style={{opacity: 1 - fade, position: "absolute", inset: 0}}>
        <Row style={{justifyContent: "space-between", marginBottom: 16}}>
          <H sub="AIのドラフトを監査人が確認・修正し、レビューに回します。">追加手続案・調書メモ・会社報告ドラフト</H>
          <Row style={{gap: 12}}><Button>チームに共有</Button><Button primary pressed={review}>レビュー依頼</Button></Row>
        </Row>
        <Row style={{gap: 18, alignItems: "stretch"}}>
          <Panel title="追加手続案" right={<Pill tone="neutral">見積 24h</Pill>} style={{flex: 1}}>
            {D.PROCEDURES.map((p, i) => (
              <Reveal key={p.name} at={6 + i * 9}>
                <Row style={{justifyContent: "space-between", alignItems: "flex-start", padding: "12px 4px", borderBottom: `1px solid ${c.line}`, fontSize: 18, lineHeight: 1.6}}>
                  <span><span style={{color: c.teal, fontWeight: 700, marginRight: 8}}>{i + 1}</span>{p.name}</span><Pill>{p.hours}</Pill>
                </Row>
              </Reveal>
            ))}
            <Reveal at={46}><div style={{marginTop: 12, fontSize: 15, color: c.muted}}>論点：収益認識の時点 ／ 回収可能性 ／ 経営者の関与</div></Reveal>
          </Panel>
          <Panel title="調書メモ（ドラフト）" right={<Pill tone="teal">証拠リンク {links}件</Pill>} style={{flex: 1.2}}>
            {D.MEMO.map((m, i) => <Reveal key={i} at={30 + i * 16}><div style={{fontSize: 18, lineHeight: 1.75, padding: "8px 0", borderBottom: `1px solid ${c.line}`}}>{m.split(/(（[^）]*）)/).map((part, j) => part.startsWith("（") ? <span key={j} style={{color: c.teal, textDecoration: "underline"}}>{part}</span> : part)}</div></Reveal>)}
            <Reveal at={100}><div style={{marginTop: 12, fontSize: 15, color: c.muted}}>作成：AIドラフト ／ 確認：田中（主査） ／ 2030年10月26日</div></Reveal>
          </Panel>
          <Panel title="会社報告ドラフト" right={<Pill tone="neutral">経営者向け</Pill>} style={{flex: 1}}>
            <Reveal at={70}><div style={{fontSize: 20, fontWeight: 700, marginBottom: 10}}>{D.REPORT_DRAFT[0]}</div></Reveal>
            <Reveal at={84}><div style={{fontSize: 18, lineHeight: 1.75}}>{D.REPORT_DRAFT[1]}</div></Reveal>
            <Reveal at={100}><div style={{fontSize: 18, lineHeight: 1.75, marginTop: 12}}>{D.REPORT_DRAFT[2]}</div></Reveal>
            <Reveal at={116}><div style={{marginTop: 16, padding: "12px 14px", ...aiPanel, fontSize: 15, lineHeight: 1.6}}>表現は断定を避け、確認中である旨を明記しています。送付前にパートナーレビューが必要です。</div></Reveal>
          </Panel>
        </Row>
        <TouchRing at={170} x={1540} y={16} />
        {review ? <Reveal at={176}><div style={{position: "absolute", right: 0, bottom: 0, ...aiPanel, padding: "14px 20px", fontSize: 18}}>レビュー依頼を送信しました：主査 → パートナー</div></Reveal> : null}
      </div>
      {g >= 0 ? <div style={{opacity: fade, position: "absolute", inset: 0}}>
        <Row style={{justifyContent: "space-between", marginBottom: 16}}>
          <H sub="主査からのレビュー依頼。AIのドラフトと監査人の判断を確認します。">パートナーレビュー：MNT Asia Trading</H>
          <Row style={{gap: 14}}><Presence names={["田", "佐", "山"]} live={3} /><Pill tone={done ? "green" : "high"}>{done ? "承認済み" : "承認待ち"}</Pill></Row>
        </Row>
        <div style={{...aiPanel, padding: "18px 24px", position: "absolute", left: 0, right: 0, top: 70, height: 250}}>
          <Row style={{justifyContent: "space-between"}}><div style={{fontSize: 20, fontWeight: 700}}>AIの確認</div><Pill tone="ai">{done ? "履歴に反映" : "根拠を再確認済み"}</Pill></Row>
          <Row style={{gap: 30, marginTop: 12, alignItems: "flex-start"}}>
            <div style={{flex: 1.2, fontSize: 17, lineHeight: 1.7}}>追加手続案は論点1〜3（収益認識の時点、回収可能性、経営者の関与）を網羅しています。会社報告ドラフトは断定を避けた表現になっています。{done ? "判断理由を履歴に保存し、類似案件の参照知識に追加しました。" : "根拠：販売契約書 p.7 ／ 取締役会議事録 p.4 ／ 売上明細 ／ 回収状況一覧"}</div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 15, color: c.aiMuted, marginBottom: 6}}>追加手続案（4件）</div>
              {D.PROCEDURES.map((p, i) => <Row key={p.name} style={{justifyContent: "space-between", fontSize: 16, padding: "5px 0", borderBottom: `1px solid ${c.aiLine}18`}}><span><span style={{color: c.aiLine, fontWeight: 700, marginRight: 8}}>{i + 1}</span>{p.name}</span><Pill tone={done ? "green" : "ai"}>{done ? "承認" : p.hours}</Pill></Row>)}
            </div>
          </Row>
          <BreathLine phases={[[A0, "done"], [A0 + T.approve.tap, "think"], [A0 + T.approve.done, "done"]]} style={{marginTop: 10}} />
        </div>
        <div style={{...panel, padding: "20px 24px", position: "absolute", left: 0, top: 380, width: 880}}>
          <div style={{fontSize: 20, fontWeight: 700, color: c.navy}}>判断</div>
          <Row style={{gap: 14, marginTop: 12}}>
            <span style={{width: 300, fontSize: 15, color: c.muted, lineHeight: 1.5}}>承認すると判断理由が履歴に残り、今後のAIの参照知識になります。</span>
            <Button primary pressed={tapped} style={{fontSize: 20, padding: "14px 30px"}}>{done ? "承認済み" : "承認"}</Button>
            <Button style={{fontSize: 20, padding: "14px 30px"}}>差し戻し</Button>
          </Row>
          {tapped ? <Reveal at={A0 + T.approve.tap + 8}>
            <div style={{marginTop: 16, fontSize: 15, color: c.muted}}>判断理由（短く）</div>
            <div style={{marginTop: 6, padding: "14px 16px", border: `1px solid ${done ? c.line : g >= T.approve.tap2 ? c.green : c.teal}`, borderRadius: 10, fontSize: 19, lineHeight: 1.6, minHeight: 60,
              background: g >= T.approve.tap2 && !done ? c.greenSoft : "white"}}>{reason}{!done && g < T.approve.tap2 && f % 16 < 8 ? <span style={{color: c.teal}}>|</span> : null}</div>
          </Reveal> : null}
          {done ? <Reveal at={A0 + T.approve.done}><Row style={{marginTop: 14, gap: 12, fontSize: 16, color: c.green}}><span style={{fontWeight: 700}}>✓ 承認しました</span><span style={{color: c.muted}}>山本（パートナー）／ 10月26日 17:42 ／ 履歴に記録</span></Row></Reveal> : null}
        </div>
        <div style={{...panel, padding: "20px 24px", position: "absolute", left: 900, right: 0, top: 380, bottom: 0}}>
          <div style={{fontSize: 20, fontWeight: 700, color: c.navy}}>会社報告ドラフト</div>
          <div style={{fontSize: 18, fontWeight: 700, marginTop: 12}}>{D.REPORT_DRAFT[0]}</div>
          <div style={{fontSize: 17, lineHeight: 1.7, marginTop: 8}}>{D.REPORT_DRAFT[1]}</div>
          <div style={{fontSize: 17, lineHeight: 1.7, marginTop: 8}}>{D.REPORT_DRAFT[2]}</div>
          <div style={{marginTop: 12, fontSize: 15, color: c.muted}}>{done ? "承認後に送付可能になります。" : "送付前にパートナーの承認が必要です。"}</div>
        </div>
        <TouchRing at={A0 + T.approve.tap} x={T.approve.p1[0] - 268} y={T.approve.p1[1] - 92} />
        <TouchRing at={A0 + T.approve.tap2} x={T.approve.p2[0] - 268} y={T.approve.p2[1] - 92} />
      </div> : null}
    </AppShell>
  );
};
