import {useCurrentFrame} from "remotion";
import {AppShell, Button, H, Kpi, Pill, Row, Score, c, panel} from "./ui";
import {AnimCursor, GrowBar, Toast, useReveal, useT, useTyped, useVisible} from "./anim";
import * as D from "./data";

const Panel: React.FC<{title?: string; right?: React.ReactNode; style?: React.CSSProperties; children: React.ReactNode}> = ({title, right, style, children}) => (
  <div style={{...panel, padding: "20px 24px", ...style}}>
    {title ? <Row style={{justifyContent: "space-between", marginBottom: 14}}><div style={{fontSize: 21, fontWeight: 700, color: c.navy}}>{title}</div>{right}</Row> : null}
    {children}
  </div>
);

const Reveal: React.FC<{at: number; style?: React.CSSProperties; children: React.ReactNode}> = ({at, style, children}) => {
  const s = useReveal(at);
  return <div style={{...s, ...style}}>{children}</div>;
};

/* 1. トップ：子会社リスクスコアの分布 → 高スコアの会社をクリック */
export const ScreenTop: React.FC = () => {
  const f = useCurrentFrame();
  const max = Math.max(...D.HISTOGRAM.map((h) => h.n));
  const grow = useT(6, 26);
  const hover = f >= 56;
  const clicked = f >= 86;
  const pulse = clicked ? 0.5 + 0.5 * Math.sin((f - 86) / 3) : 0;
  return (
    <AppShell active={0} crumbs={["ダッシュボード", "子会社リスクスコア"]}>
      <H sub="機械学習モデルによる確認優先度（0〜100）。不正の確率ではありません。">子会社リスクスコアの分布</H>
      <Row style={{gap: 16, marginBottom: 18}}>
        {[["対象子会社", "20社", "連結子会社", "neutral"], ["スコア 75以上", "1社", "MNT Asia Trading", "high"], ["前月から上昇", "3社", "+10pt以上", "neutral"], ["データ取込", "10月25日", "試算表・売上明細・入金明細", "neutral"]].map((k, i) => (
          <Reveal key={k[0]} at={i * 4} style={{flex: 1, display: "flex"}}><Kpi label={k[0]} value={k[1]} note={k[2]} tone={k[3] as "high" | "neutral"} /></Reveal>
        ))}
      </Row>
      <Row style={{gap: 18, alignItems: "stretch"}}>
        <Panel title="リスクスコア別の会社数" right={<Pill tone="teal">2026年3月期 第3四半期まで</Pill>} style={{flex: 1.35, position: "relative"}}>
          <div style={{position: "relative", height: 470, marginTop: 10}}>
            <div style={{position: "absolute", left: 60, right: 10, top: 10, bottom: 56, borderLeft: `1px solid ${c.line}`, borderBottom: `1px solid ${c.line}`}}>
              {[0, 1, 2, 3, 4, 5].map((v) => (
                <div key={v} style={{position: "absolute", left: 0, right: 0, bottom: `${(v / max) * 100}%`, borderTop: v ? `1px dashed ${c.line}` : "none"}}>
                  <span style={{position: "absolute", left: -34, top: -11, fontSize: 15, color: c.muted}}>{v}</span>
                </div>
              ))}
              <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", gap: 14, padding: "0 16px"}}>
                {D.HISTOGRAM.map((h) => {
                  const pct = (h.n / max) * 100 * grow;
                  return (
                    <div key={h.bin} style={{flex: 1, position: "relative", height: "100%", display: "flex", alignItems: "flex-end"}}>
                      <div style={{width: "100%", height: `${pct}%`, background: h.hit ? c.high : c.low, borderRadius: "6px 6px 0 0",
                        outline: h.hit && hover ? `4px solid ${c.amberSoft}` : "none", filter: h.hit && hover ? "brightness(1.08)" : "none"}} />
                      {h.hit && hover ? <div style={{position: "absolute", bottom: `calc(${pct}% + 14px)`, left: "50%", translate: "-50% 0", ...panel, padding: "6px 12px", fontSize: 16, whiteSpace: "nowrap", boxShadow: "0 6px 18px #0002"}}>
                        <b>{D.TARGET.name}</b>　スコア <Score v={87} size={18} />　<span style={{color: c.muted}}>クリックで内訳</span></div> : null}
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
        <Panel title="スコア上位の子会社" right={<span style={{fontSize: 16, color: c.muted}}>クリックで内訳を表示</span>} style={{flex: 1}}>
          <div style={{display: "grid", gridTemplateColumns: "1fr 170px 70px 80px", fontSize: 15, color: c.muted, padding: "0 10px 8px"}}>
            <span>子会社</span><span>事業</span><span style={{textAlign: "right"}}>スコア</span><span style={{textAlign: "right"}}>前月比</span>
          </div>
          {D.COMPANIES.map((k, i) => (
            <Reveal key={k.name} at={10 + i * 4}>
              <div style={{display: "grid", gridTemplateColumns: "1fr 170px 70px 80px", alignItems: "center", padding: "13px 10px", fontSize: 19,
                background: k.hit ? (clicked ? `rgba(217,130,43,${0.18 + 0.18 * pulse})` : hover ? c.amberSoft : "transparent") : "transparent",
                borderRadius: 8, border: k.hit && hover ? `1px solid ${c.high}` : "1px solid transparent", marginBottom: 4}}>
                <span style={{fontWeight: k.hit ? 700 : 500}}>{k.name}</span>
                <span style={{color: c.muted, fontSize: 16}}>{k.biz}</span>
                <span style={{textAlign: "right"}}><Score v={k.score} size={22} /></span>
                <span style={{textAlign: "right", fontSize: 16, color: k.prev === 0 ? c.muted : k.score - k.prev > 0 ? c.high : c.muted}}>{k.prev === 0 ? "新規" : (k.score - k.prev > 0 ? "+" : "") + (k.score - k.prev)}</span>
              </div>
            </Reveal>
          ))}
        </Panel>
      </Row>
      <AnimCursor keys={[{f: 0, x: 620, y: 420}, {f: 20, x: 620, y: 420}, {f: 56, x: 752, y: 640}, {f: 86, x: 752, y: 640, click: true}, {f: 191, x: 752, y: 640}]} />
      {f >= 150 ? <div style={{position: "absolute", inset: -40, background: `rgba(243,245,248,${(f - 150) / 60})`}} /> : null}
    </AppShell>
  );
};

/* 2. ドリルダウン：科目区分の内訳 → 区分を選び、AIに質問 */
export const ScreenDrilldown: React.FC = () => {
  const f = useCurrentFrame();
  const maxPts = D.CATEGORIES[0].pts;
  const selected = f >= 72;
  const w = 560, h = 150;
  const draw = useT(92, 50);
  const n = Math.max(2, Math.round(D.TREND.length * draw));
  const pts = D.TREND.slice(0, n).map((v, i) => `${(i / (D.TREND.length - 1)) * w},${h - ((v - 60) / 60) * h}`).join(" ");
  return (
    <AppShell active={2} crumbs={["子会社一覧", D.TARGET.name, "スコアの内訳"]}>
      <Reveal at={0}>
        <Row style={{justifyContent: "space-between", marginBottom: 16}}>
          <div style={{fontSize: 30, fontWeight: 700, color: c.navy}}>{D.TARGET.name} <span style={{fontSize: 19, color: c.muted, fontWeight: 400, marginLeft: 10}}>{D.TARGET.region}</span></div>
          <Row style={{gap: 26}}>
            <div><div style={{fontSize: 15, color: c.muted}}>総合スコア</div><Score v={D.TARGET.score} size={40} /></div>
            <div><div style={{fontSize: 15, color: c.muted}}>前月</div><div style={{fontSize: 28, fontWeight: 700}}>{D.TARGET.prev} <span style={{color: c.high, fontSize: 20}}>▲33</span></div></div>
            <Pill tone="high">要確認</Pill>
          </Row>
        </Row>
      </Reveal>
      <Row style={{gap: 18, alignItems: "stretch"}}>
        <Panel title="科目区分ごとのスコア内訳" right={<span style={{fontSize: 16, color: c.muted}}>合計 87pt ／ 区分をクリックで指標を表示</span>} style={{flex: 1.1}}>
          {D.CATEGORIES.map((k, i) => (
            <div key={k.name} style={{display: "grid", gridTemplateColumns: "190px 1fr 64px", alignItems: "center", gap: 14, padding: "11px 12px", borderRadius: 8,
              background: k.hit && selected ? c.amberSoft : k.hit && f >= 60 ? "#fbf4ea" : "transparent", border: k.hit && selected ? `1px solid ${c.high}` : "1px solid transparent", marginBottom: 6, fontSize: 19}}>
              <span style={{fontWeight: k.hit ? 700 : 500}}>{k.name}</span>
              <GrowBar pct={(k.pts / maxPts) * 100} color={k.hit ? c.high : c.low} start={6 + i * 4} />
              <span style={{textAlign: "right", fontWeight: 700, color: k.hit ? c.high : c.navy}}>{k.pts}pt</span>
            </div>
          ))}
          <div style={{fontSize: 15, color: c.muted, marginTop: 10}}>内訳は各区分の指標がスコアに寄与した点数。モデルの説明可能性（SHAP値）に基づく表示。</div>
        </Panel>
        <Panel title={selected ? "売上高・売上債権：主要指標" : "主要指標"} right={selected ? <Pill tone="high">寄与 38pt</Pill> : <span style={{fontSize: 16, color: c.muted}}>区分を選択してください</span>} style={{flex: 1, position: "relative"}}>
          {selected ? <>
            {D.INDICATORS.map((k, i) => (
              <Reveal key={k.name} at={78 + i * 7}>
                <Row style={{justifyContent: "space-between", padding: "11px 6px", borderBottom: `1px solid ${c.line}`, fontSize: 19}}>
                  <span>{k.name}</span>
                  <Row style={{gap: 12}}><span style={{fontSize: 15, color: c.muted}}>{k.ref}</span><b style={{color: k.tone === "high" ? c.high : "#9a6b1c", fontSize: 22}}>{k.value}</b></Row>
                </Row>
              </Reveal>
            ))}
            <Reveal at={92}>
              <div style={{marginTop: 18, fontSize: 16, color: c.muted}}>売上債権回転日数の推移（月次）</div>
              <svg width={w} height={h + 20} style={{marginTop: 6, overflow: "visible"}}>
                <polyline points={pts} fill="none" stroke={c.high} strokeWidth={3} />
                {D.TREND.slice(0, n).map((v, i) => <circle key={i} cx={(i / (D.TREND.length - 1)) * w} cy={h - ((v - 60) / 60) * h} r={4} fill={c.high} />)}
                {draw >= 1 ? <text x={w} y={h - ((112 - 60) / 60) * h - 12} textAnchor="end" fontSize={16} fill={c.high} fontWeight={700}>112日</text> : null}
                <text x={0} y={h + 16} fontSize={14} fill={c.muted}>1月</text><text x={w} y={h + 16} fontSize={14} fill={c.muted} textAnchor="end">10月</text>
              </svg>
            </Reveal>
            <Reveal at={140}><Row style={{justifyContent: "flex-end", marginTop: 14}}><Button primary style={{filter: f >= 180 ? "brightness(0.85)" : "none"}}>この区分についてAIに質問</Button></Row></Reveal>
          </> : <div style={{height: 520, display: "grid", placeItems: "center", color: c.muted, fontSize: 18}}>左の科目区分を選択すると、関連する指標と推移を表示します。</div>}
        </Panel>
      </Row>
      <AnimCursor keys={[{f: 0, x: 420, y: 430}, {f: 30, x: 420, y: 430}, {f: 62, x: 120, y: 184}, {f: 72, x: 120, y: 184, click: true}, {f: 140, x: 120, y: 184}, {f: 172, x: 1480, y: 676}, {f: 182, x: 1480, y: 676, click: true}, {f: 191, x: 1480, y: 676}]} />
    </AppShell>
  );
};

/* 3. AIへの質問と、スコア背景の説明 */
export const ScreenAsk: React.FC = () => {
  const f = useCurrentFrame();
  const typed = useTyped(D.QUESTION, 4, 13);
  const sent = f >= 52;
  const thinking = f >= 52 && f < 66;
  const answered = f >= 66;
  const excerpt = f >= 120;
  return (
    <AppShell active={2} crumbs={["スコア分析", D.TARGET.name, "売上高・売上債権", "AIに質問"]}>
      <Row style={{gap: 18, alignItems: "stretch"}}>
        <div style={{flex: 1}}>
          <Panel title="分析アシスタント" right={<Pill tone="teal">文脈：MNT Asia Trading ／ 売上高・売上債権</Pill>} style={{height: 892, position: "relative"}}>
            {sent ? <div style={{display: "flex", justifyContent: "flex-end", marginTop: 6}}>
              <div style={{background: c.navy, color: "white", padding: "14px 18px", borderRadius: "14px 14px 3px 14px", fontSize: 21, maxWidth: 620}}>{D.QUESTION}</div>
            </div> : null}
            {sent ? <div style={{marginTop: 18, display: "flex", gap: 12}}>
              <span style={{width: 34, height: 34, borderRadius: 17, background: c.tealSoft, color: c.teal, display: "grid", placeItems: "center", fontWeight: 800, flex: "none"}}>AI</span>
              <div style={{flex: 1}}>
                {thinking ? <div style={{fontSize: 20, color: c.muted}}>資料を参照しています{"・".repeat(1 + Math.floor((f - 52) / 4) % 3)}</div> : null}
                {answered ? <>
                  <Reveal at={66}><div style={{fontSize: 20, lineHeight: 1.7}}>投入済みのクライアントデータと関連資料を参照し、スコアが高い背景を整理しました。</div></Reveal>
                  <Reveal at={74}><div style={{fontSize: 16, color: c.muted, marginTop: 14, fontWeight: 700}}>スコアの背景（参照元つき）</div></Reveal>
                  {D.ANSWER_BACKGROUND.map((a, i) => (
                    <Reveal key={i} at={80 + i * 14}>
                      <div style={{display: "grid", gridTemplateColumns: "28px 1fr auto", gap: 10, alignItems: "start", padding: "10px 0", borderBottom: `1px solid ${c.line}`, fontSize: 19, lineHeight: 1.6}}>
                        <span style={{color: c.teal, fontWeight: 700}}>{i + 1}</span><span>{a.text}</span><Pill tone="teal">{a.src}</Pill>
                      </div>
                    </Reveal>
                  ))}
                  <Reveal at={142}><div style={{fontSize: 16, color: c.muted, marginTop: 16, fontWeight: 700}}>推測される背景</div></Reveal>
                  <Row style={{gap: 10, marginTop: 8, flexWrap: "wrap"}}>
                    {D.HYPOTHESES.map((h, i) => <Reveal key={h.name} at={148 + i * 8}><span style={{...panel, display: "inline-block", padding: "10px 14px", fontSize: 18}}>{h.name}　<Pill tone={h.conf === "高" ? "high" : "mid"}>確からしさ {h.conf}</Pill></span></Reveal>)}
                  </Row>
                  <Reveal at={176}><div style={{marginTop: 18, fontSize: 19, lineHeight: 1.7}}>次に、確認すべき論点を整理し、スコアの再分析と関連資料の探索を進めます。</div></Reveal>
                </> : null}
              </div>
            </div> : null}
            <div style={{position: "absolute", left: 24, right: 24, bottom: 20, border: `1px solid ${sent ? c.line : c.teal}`, borderRadius: 10, padding: "14px 16px", fontSize: 19, display: "flex", justifyContent: "space-between", background: "white"}}>
              <span style={{color: sent ? "#8a96a8" : c.text}}>{sent ? "追加の質問、または資料を投入…" : typed}{!sent && f % 16 < 8 ? <span style={{color: c.teal}}>|</span> : null}</span>
              <span style={{color: c.teal, fontWeight: 700}}>送信</span>
            </div>
          </Panel>
        </div>
        <div style={{width: 500}}>
          <Panel title="参照した資料" style={{marginBottom: 18}}>
            {["売上明細（2026年3月期 Q1–Q3）", "与信管理台帳", "取締役会議事録（第3四半期）", "販売契約書（新規得意先3社）", "入金明細（基準日＋20日）"].map((s, i) => (
              <Row key={s} style={{justifyContent: "space-between", padding: "10px 4px", borderBottom: `1px solid ${c.line}`, fontSize: 18}}>
                <span>{s}</span>{f >= 56 + i * 5 ? <Pill tone={f < 66 ? "teal" : "green"}>{f < 66 ? "参照中" : "参照済"}</Pill> : <Pill>投入済</Pill>}
              </Row>
            ))}
          </Panel>
          {excerpt ? <Reveal at={120}><Panel title="販売契約書 p.7（該当箇所）">
            <div style={{fontSize: 16, lineHeight: 1.7, color: c.muted}}>第12条（売上計上）<br />
              <span style={{background: c.tealSoft, color: c.text, padding: "2px 4px"}}>甲は、乙による書面の検収をもって売上を計上する。</span>検収は納品後10営業日以内に行うものとし…</div>
          </Panel></Reveal> : null}
        </div>
      </Row>
      <AnimCursor keys={[{f: 0, x: 900, y: 860}, {f: 40, x: 900, y: 860}, {f: 48, x: 1040, y: 848}, {f: 52, x: 1040, y: 848, click: true}, {f: 70, x: 1040, y: 848}, {f: 100, x: 1180, y: 520}, {f: 191, x: 1180, y: 520}]} show={[0, 110]} />
    </AppShell>
  );
};

/* 4. 論点の整理と自律的な分析、クライアント確認事項 */
export const ScreenIssues: React.FC = () => {
  const f = useCurrentFrame();
  const progress = useT(60, 80) * 68;
  const status = (i: number) => {
    if (i === 0) return f >= 20 ? "完了" : "実行中";
    if (i === 1) return f >= 55 ? "完了 ／ 12件" : f >= 20 ? "実行中" : "待機";
    if (i === 2) return f >= 60 ? `実行中 ${Math.round(progress)}%` : "待機";
    return "待機";
  };
  return (
    <AppShell active={4} crumbs={["論点管理", D.TARGET.name, "売上高・売上債権"]}>
      <H sub="AIが対話から論点を整理し、スコア分析と資料探索を自律的に実行します。">確認すべき論点と分析の進行</H>
      <Row style={{gap: 18, alignItems: "stretch"}}>
        <Panel title="確認すべき論点" style={{flex: 1}}>
          {D.ISSUES.map((k, i) => (
            <Reveal key={k.name} at={4 + i * 10}>
              <div style={{padding: "14px 12px", borderRadius: 10, background: i === 0 ? c.amberSoft : "#f7f9fb", marginBottom: 10}}>
                <div style={{fontSize: 20, fontWeight: 700}}>{i + 1}. {k.name}</div>
                <div style={{fontSize: 17, color: c.muted, marginTop: 4}}>{k.detail}</div>
              </div>
            </Reveal>
          ))}
          <Reveal at={40}><div style={{fontSize: 16, color: c.muted, marginTop: 6}}>対話の内容から整理。論点は監査人が追加・修正できます。</div></Reveal>
        </Panel>
        <Panel title="自律分析の進行" right={<Pill tone="teal">実行中</Pill>} style={{flex: 1.2}}>
          {D.AUTO_STEPS.map((s, i) => {
            const st = status(i);
            return (
              <div key={s.name} style={{padding: "12px 6px", borderBottom: `1px solid ${c.line}`}}>
                <Row style={{justifyContent: "space-between", fontSize: 19}}>
                  <span>{s.name}</span>
                  <Pill tone={st.startsWith("完了") ? "green" : st.startsWith("実行") ? "teal" : "neutral"}>{st}</Pill>
                </Row>
                {st.startsWith("実行") && i === 2 ? <div style={{height: 8, background: "#eef1f5", borderRadius: 4, marginTop: 10}}><div style={{width: `${progress}%`, height: "100%", background: c.teal, borderRadius: 4}} /></div> : null}
              </div>
            );
          })}
          {useVisible(70) ? <Reveal at={70}><div style={{marginTop: 16, fontSize: 17, color: c.muted, lineHeight: 1.7}}>探索した資料 12件のうち、論点に関係する箇所 7件をハイライトしました。</div></Reveal> : null}
        </Panel>
        <Panel title="クライアントへの確認事項" right={<Button style={{filter: f >= 176 ? "brightness(0.85)" : "none"}}>確認依頼を作成</Button>} style={{flex: 1}}>
          {D.CLIENT_ASKS.map((s, i) => (
            <Reveal key={s} at={90 + i * 14}>
              <Row style={{alignItems: "flex-start", gap: 12, padding: "12px 4px", borderBottom: `1px solid ${c.line}`, fontSize: 19, lineHeight: 1.6}}>
                <span style={{width: 24, height: 24, border: `2px solid ${c.teal}`, borderRadius: 6, flex: "none", marginTop: 4, background: f >= 176 ? c.teal : "white"}} /><span>{s}</span>
              </Row>
            </Reveal>
          ))}
          <Reveal at={132}><div style={{marginTop: 14, fontSize: 16, color: c.muted}}>受領後にアプリへ投入すると、分析が自動で更新されます。</div></Reveal>
        </Panel>
      </Row>
      <AnimCursor keys={[{f: 0, x: 1100, y: 600}, {f: 130, x: 1100, y: 600}, {f: 166, x: 1512, y: 104}, {f: 176, x: 1512, y: 104, click: true}, {f: 191, x: 1512, y: 104}]} show={[120, 191]} />
      <Toast start={182}>確認依頼を作成しました（3件）</Toast>
    </AppShell>
  );
};

/* 5. 追加資料の投入と深掘り、同業比較・経営指標 */
export const ScreenDeepen: React.FC = () => {
  const f = useCurrentFrame();
  const maxDays = 120;
  const fileState = (i: number) => {
    const t0 = 8 + i * 22;
    if (f < t0) return null;
    if (f < t0 + 16) return "取込中";
    return "取込済";
  };
  const updated = f >= 84;
  return (
    <AppShell active={3} crumbs={["資料・データ", D.TARGET.name, "追加資料の投入"]}>
      <H sub="受領した資料を投入すると、AIがそれを踏まえて分析を更新します。">追加資料を踏まえた深掘り</H>
      <Row style={{gap: 18, alignItems: "stretch"}}>
        <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 18}}>
          <Panel title="受領資料の投入" right={<Pill tone={f >= 74 ? "green" : "neutral"}>{f >= 74 ? "3件 取込済" : "取込中"}</Pill>}>
            {D.RECEIVED.map((r, i) => {
              const st = fileState(i);
              return st ? <Reveal key={r.name} at={8 + i * 22}><Row style={{justifyContent: "space-between", padding: "10px 6px", borderBottom: `1px solid ${c.line}`, fontSize: 18}}><span>{r.name}</span><Pill tone={st === "取込済" ? "green" : "teal"}>{st}</Pill></Row></Reveal> : null;
            })}
            <div style={{marginTop: 12, border: `2px dashed ${f < 74 ? c.teal : c.line}`, borderRadius: 10, padding: 16, textAlign: "center", color: c.muted, fontSize: 17, background: f < 74 ? c.tealSoft : "transparent"}}>{f < 74 ? "ファイルを受け付けています…" : "ここにファイルをドロップ、またはクリックして追加"}</div>
          </Panel>
          <Panel title="更新された分析" right={updated ? <Pill tone="teal">10月26日 09:40 更新</Pill> : <Pill>分析を更新中</Pill>}>
            {updated ? D.UPDATED_FINDINGS.map((fi, i) => <Reveal key={i} at={84 + i * 14}><div style={{display: "grid", gridTemplateColumns: "26px 1fr", gap: 8, padding: "9px 0", fontSize: 18, lineHeight: 1.65}}><span style={{color: c.teal, fontWeight: 700}}>{i + 1}</span><span>{fi}</span></div></Reveal>)
              : <div style={{height: 120, display: "grid", placeItems: "center", color: c.muted, fontSize: 17}}>投入された資料を読み込み、論点と照合しています…</div>}
          </Panel>
        </div>
        <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 18}}>
          <Panel title="同業比較：売上債権回転日数">
            {D.PEERS.map((p, i) => (
              <div key={p.name} style={{display: "grid", gridTemplateColumns: "250px 1fr 70px", alignItems: "center", gap: 14, padding: "10px 0", fontSize: 18}}>
                <span style={{fontWeight: p.hit ? 700 : 500}}>{p.name}</span>
                <GrowBar pct={(p.days / maxDays) * 100} color={p.hit ? c.high : c.low} start={96 + i * 8} />
                <b style={{textAlign: "right", color: p.hit ? c.high : c.navy, opacity: f >= 110 + i * 8 ? 1 : 0}}>{p.days}日</b>
              </div>
            ))}
            <div style={{fontSize: 15, color: c.muted, marginTop: 6}}>同業データ：外部データベース（東南アジア 販売会社 42社）</div>
          </Panel>
          <Panel title="経営指標との整合">
            <Row style={{gap: 14}}>
              {D.METRICS.map((m, i) => <Reveal key={m.name} at={120 + i * 8} style={{flex: 1}}><div style={{background: "#f7f9fb", borderRadius: 10, padding: "12px 14px"}}><div style={{fontSize: 15, color: c.muted}}>{m.name}</div><div style={{fontSize: 28, fontWeight: 800, color: c.navy}}>{m.value}</div><div style={{fontSize: 15, color: c.muted}}>{m.ref}</div></div></Reveal>)}
            </Row>
            {useVisible(150) ? <Reveal at={150}><div style={{marginTop: 14, padding: "12px 14px", background: c.tealSoft, borderRadius: 10, fontSize: 18, lineHeight: 1.65}}>
              <b style={{color: c.teal}}>AIの示唆：</b>売上の伸びに対して営業キャッシュフローが減少しており、回転日数の長期化と整合します。収益認識の時点を重点的に確認することを推奨します。
            </div></Reveal> : null}
          </Panel>
        </div>
      </Row>
    </AppShell>
  );
};

/* 6. 成果物：追加手続案・調書メモ・会社報告ドラフト → レビュー依頼 */
export const ScreenOutputs: React.FC = () => {
  const f = useCurrentFrame();
  const links = Math.min(4, Math.floor(Math.max(0, f - 30) / 16));
  return (
    <AppShell active={5} crumbs={["調書", D.TARGET.name, "成果物のドラフト"]}>
      <Row style={{justifyContent: "space-between", marginBottom: 16}}>
        <H sub="AIのドラフトを監査人が確認・修正し、レビューに回します。">追加手続案・調書メモ・会社報告ドラフト</H>
        <Row style={{gap: 12}}><Button>チームに共有</Button><Button primary style={{filter: f >= 170 ? "brightness(0.85)" : "none"}}>レビュー依頼</Button></Row>
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
          <Reveal at={46}><div style={{marginTop: 12, fontSize: 16, color: c.muted}}>論点：収益認識の時点 ／ 回収可能性 ／ 経営者の関与</div></Reveal>
        </Panel>
        <Panel title="調書メモ（ドラフト）" right={<Pill tone="teal">証拠リンク {links}件</Pill>} style={{flex: 1.2}}>
          {D.MEMO.map((m, i) => <Reveal key={i} at={30 + i * 16}><div style={{fontSize: 18, lineHeight: 1.75, padding: "8px 0", borderBottom: `1px solid ${c.line}`}}>{m.split(/(（[^）]*）)/).map((part, j) => part.startsWith("（") ? <span key={j} style={{color: c.teal, textDecoration: "underline"}}>{part}</span> : part)}</div></Reveal>)}
          <Reveal at={100}><div style={{marginTop: 12, fontSize: 16, color: c.muted}}>作成：AIドラフト ／ 確認：田中（主査） ／ 2026年10月26日</div></Reveal>
        </Panel>
        <Panel title="会社報告ドラフト" right={<Pill tone="neutral">経営者向け</Pill>} style={{flex: 1}}>
          <Reveal at={70}><div style={{fontSize: 20, fontWeight: 700, marginBottom: 10}}>{D.REPORT_DRAFT[0]}</div></Reveal>
          <Reveal at={84}><div style={{fontSize: 18, lineHeight: 1.75}}>{D.REPORT_DRAFT[1]}</div></Reveal>
          <Reveal at={100}><div style={{fontSize: 18, lineHeight: 1.75, marginTop: 12}}>{D.REPORT_DRAFT[2]}</div></Reveal>
          <Reveal at={116}><div style={{marginTop: 16, padding: "10px 12px", background: "#f7f9fb", borderRadius: 8, fontSize: 15, color: c.muted}}>表現は断定を避け、確認中である旨を明記しています。送付前にパートナーレビューが必要です。</div></Reveal>
        </Panel>
      </Row>
      <AnimCursor keys={[{f: 0, x: 980, y: 520}, {f: 130, x: 980, y: 520}, {f: 162, x: 1560, y: 34}, {f: 170, x: 1560, y: 34, click: true}, {f: 191, x: 1560, y: 34}]} show={[124, 191]} />
      <Toast start={176}>レビュー依頼を送信しました：主査 → パートナー</Toast>
    </AppShell>
  );
};
