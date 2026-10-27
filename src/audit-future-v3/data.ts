// All figures are fictional demo data for a concept film.
export const CLIENT = "ミナトホールディングス";
export const TARGET = {name: "MNT Asia Trading", region: "シンガポール ／ 販売", score: 87, prev: 54};

export const HISTOGRAM = [
  {bin: "0–9", n: 0}, {bin: "10–19", n: 1}, {bin: "20–29", n: 3}, {bin: "30–39", n: 5}, {bin: "40–49", n: 4},
  {bin: "50–59", n: 3}, {bin: "60–69", n: 2}, {bin: "70–79", n: 1}, {bin: "80–89", n: 1, hit: true}, {bin: "90–100", n: 0},
];

export const COMPANIES = [
  {name: "MNT Asia Trading", biz: "販売（海外）", score: 87, prev: 54, hit: true},
  {name: "Orbis Labs", biz: "ソフトウェア（新規連結）", score: 71, prev: 0},
  {name: "北関東精機", biz: "製造（国内）", score: 58, prev: 55},
  {name: "ミナトロジスティクス", biz: "物流（国内）", score: 46, prev: 48},
  {name: "MNT Europe GmbH", biz: "販売（海外）", score: 41, prev: 39},
  {name: "ミナトサービス", biz: "保守サービス", score: 33, prev: 35},
];

// Contribution of each account category to the total score (points).
export const CATEGORIES = [
  {name: "売上高・売上債権", pts: 38, hit: true},
  {name: "引当金", pts: 12},
  {name: "仕入・買掛金", pts: 9},
  {name: "関連当事者取引", pts: 8},
  {name: "仕訳・決算処理", pts: 7},
  {name: "棚卸資産", pts: 6},
  {name: "人件費", pts: 4},
  {name: "固定資産", pts: 3},
];

export const INDICATORS = [
  {name: "売上債権回転日数", value: "112日", ref: "前年 68日", tone: "high" as const},
  {name: "期末月の売上比率", value: "38%", ref: "前年 19%", tone: "high" as const},
  {name: "期末後入金の未達率", value: "62%", ref: "基準日＋20日", tone: "high" as const},
  {name: "新規得意先の売上比率", value: "21%", ref: "3社", tone: "mid" as const},
  {name: "貸倒引当金率", value: "0.4%", ref: "業界平均 1.8%", tone: "mid" as const},
];

export const TREND = [66, 68, 70, 69, 74, 81, 88, 97, 104, 112]; // 回転日数の推移（月次）

export const QUESTION = "売上高・売上債権のスコアが高い背景を説明してください。";

export const ANSWER_BACKGROUND = [
  {text: "第4四半期の最終週に、四半期売上の38%が計上されています。", src: "売上明細（投入済み）"},
  {text: "新規得意先3社向けの売上が21%を占め、うち2社は与信限度を超過しています。", src: "与信管理台帳"},
  {text: "第3四半期の取締役会で、新規得意先向け与信枠の2倍拡大が決議されています。", src: "取締役会議事録 p.4"},
  {text: "販売契約は「書面による検収をもって売上計上」と定めていますが、計上日と検収日の差が平均17日あります。", src: "販売契約書 p.7"},
];

export const HYPOTHESES = [
  {name: "検収前の売上計上（計上時点のずれ）", conf: "高"},
  {name: "与信緩和による回収遅延", conf: "中"},
  {name: "期末の押し込み販売", conf: "中"},
];

export const ISSUES = [
  {name: "収益認識の時点", detail: "検収条項と計上日の整合"},
  {name: "回収可能性", detail: "期末後入金と貸倒引当金の十分性"},
  {name: "経営者の関与", detail: "与信拡大の意思決定と統制の有効性"},
];

export const AUTO_STEPS = [
  {name: "スコアの再分析（科目区分：売上高・売上債権）", status: "完了"},
  {name: "関連資料の探索（契約書・議事録・入金明細）", status: "完了 ／ 12件"},
  {name: "期末後入金と売上明細の突合", status: "実行中 68%"},
  {name: "同業・グループ内子会社との比較", status: "待機"},
];

export const CLIENT_ASKS = [
  "新規得意先3社の与信審査資料と承認記録",
  "第4四半期最終週に計上した取引の検収書",
  "返品・リベート条件を含む販売契約の付属覚書",
];

export const RECEIVED = [
  {name: "与信管理規程_改定版.pdf", status: "取込済"},
  {name: "返品・リベート契約（新規3社）.pdf", status: "取込済"},
  {name: "回収状況一覧_10月末.xlsx", status: "取込済"},
];

export const UPDATED_FINDINGS = [
  "新規3社の契約に返品条件があり、売上の一部に取消可能性があります。",
  "与信限度超過2社は、規程上の例外承認が確認できません。",
  "10月末時点で期末後入金の未達率は62%から54%に改善していますが、同業水準を上回ります。",
];

export const PEERS = [
  {name: "MNT Asia Trading", days: 112, hit: true},
  {name: "同業中央値（東南アジア販社）", days: 71},
  {name: "グループ内 販売子会社平均", days: 64},
];

export const METRICS = [
  {name: "売上高成長率", value: "+31%", ref: "同業 +9%"},
  {name: "営業キャッシュフロー", value: "−12%", ref: "売上増と逆行"},
  {name: "売上総利益率", value: "31.2%", ref: "前年 24.8%"},
];

export const PROCEDURES = [
  {name: "主要得意先3社への確認状（残高・検収日）", hours: "6h"},
  {name: "期末最終週の売上取引 全件の検収書突合", hours: "10h"},
  {name: "返品・リベート契約の閲覧と収益認識の検討", hours: "4h"},
  {name: "現地営業部門へのインタビュー", hours: "4h"},
];

export const MEMO = [
  "MNT Asia Tradingの売上債権回転日数は前年68日から112日へ長期化した。",
  "販売契約は書面検収をもって売上計上と定めるが、計上日と検収日の差は平均17日（販売契約書 p.7、売上明細）。",
  "第3四半期の与信枠拡大決議（取締役会議事録 p.4）以降、新規3社向け売上が増加し、うち2社が与信限度を超過。",
  "上記より収益認識の時点と回収可能性を重点領域とし、追加手続を実施する。",
];

export const REPORT_DRAFT = [
  "海外販売子会社における売上債権の長期化について",
  "期末最終週に売上が集中し、検収日と計上日に差異が見られます。収益認識の時点と回収可能性について追加の確認を実施します。",
  "新規得意先向けの与信管理について、例外承認の運用状況を確認させてください。",
];
