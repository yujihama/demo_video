import type {RepositorySceneConfig} from "./types";

const intro = {
  chapter: "PROLOGUE",
  repository: "recent activity / 2026-08-10",
  character: "リポジトリ街",
  role: "NIGHT SHIFT",
  initials: "RC",
  accent: "#78d9ff",
  accent2: "#8b7cff",
} as const;

const mio = {
  chapter: "CHAPTER 01",
  repository: "my_work",
  character: "記録係 ミオ",
  role: "LIFELOG KEEPER",
  initials: "MW",
  accent: "#52d6a3",
  accent2: "#9befc7",
} as const;

const ai = {
  chapter: "CHAPTER 02",
  repository: "App_Idea / evidence_sheets",
  character: "設計士 アイ",
  role: "EVIDENCE ARCHITECT",
  initials: "AI",
  accent: "#86bc25",
  accent2: "#d3f37b",
} as const;

const data = {
  chapter: "CHAPTER 03",
  repository: "demo_data",
  character: "資料管理官 データ",
  role: "DATA CURATOR",
  initials: "DD",
  accent: "#ffb84d",
  accent2: "#ffe08a",
} as const;

const twin = {
  chapter: "CHAPTER 04",
  repository: "Company_Twin_Agent",
  character: "検証官 ツイン",
  role: "WORLD INSPECTOR",
  initials: "CT",
  accent: "#ff6b91",
  accent2: "#a88bff",
} as const;

const vio = {
  chapter: "CHAPTER 05",
  repository: "demo_video",
  character: "映像編集者 ビオ",
  role: "STORY EDITOR",
  initials: "DV",
  accent: "#54c9ff",
  accent2: "#ff82c8",
} as const;

const outro = {
  chapter: "EPILOGUE",
  repository: "repository learning loop",
  character: "5人の住人",
  role: "ONE LEARNING LOOP",
  initials: "∞",
  accent: "#86bc25",
  accent2: "#65c9b6",
} as const;

export const repositoryScenes: RepositorySceneConfig[] = [
  {...intro, index: 1, title: "午前0時、リポジトリ街が動き出す", detail: "人が眠る間も、今日の変更は次の仕事へ向かう。", metric: "00:00 / NIGHT", mode: "city"},
  {...intro, index: 2, title: "直近5つの更新が、ひとつの物語になる", detail: "別々のリポジトリを、役割と流れでつなぎ直す。", metric: "5 REPOSITORIES", mode: "council"},
  {...intro, index: 3, title: "今夜の住人たち", detail: "記録・設計・データ・検証・説明。それぞれの専門家が集まる。", metric: "5 ROLES / 1 CITY", mode: "council"},

  {...mio, index: 4, title: "記録係ミオ、毎朝の白紙を配る", detail: "一日の始まりに、振り返りのための場所を先に用意する。", mode: "journal"},
  {...mio, index: 5, title: "日次レビューは6時に自動生成", detail: "GitHub Actionsが、日付ごとのテンプレートを毎朝つくる。", metric: "06:00 JST", mode: "journal"},
  {...mio, index: 6, title: "入力・出力・Todoを一つの街路へ", detail: "ニュース、学び、アイデア、成果、バックログを迷子にしない。", metric: "INPUT → OUTPUT", mode: "journal"},
  {...mio, index: 7, title: "PRを、仕事の足跡として残す", detail: "プルリクエストの一覧が、何をしたかのタイムラインになる。", metric: "PR = LIFELOG", mode: "journal"},
  {...mio, index: 8, title: "今日の記録が、明日の判断材料になる", detail: "日次から週次へ。記憶ではなく履歴を読んで振り返る。", metric: "DAILY → WEEKLY", mode: "journal"},

  {...ai, index: 9, title: "設計士アイ、証跡を一枚に設計する", detail: "散らばった資料を、レビュー可能なエビデンスシートへ。", mode: "sheet"},
  {...ai, index: 10, title: "S1：契約と描画の土台", detail: "要素の型、警告、配置ルールを先に決める。", metric: "CONTRACT / RENDER", mode: "sheet"},
  {...ai, index: 11, title: "DrawingMLで、壊れにくい配置へ", detail: "セルの上に図形と接続線を置き、Excelへ決定的に組み込む。", metric: "TwoCellAnchor", mode: "sheet"},
  {...ai, index: 12, title: "S2：PDF・CSV・Excelから証跡を取得", detail: "ファイル形式ごとの取得経路を、同じ要求へ集約する。", metric: "PDF / CSV / XLSX", mode: "sheet"},
  {...ai, index: 13, title: "見つからない領域は、推測せず警告", detail: "未解決を隠さず、人が確認できる状態で返す。", metric: "REGION_UNRESOLVED", mode: "sheet"},
  {...ai, index: 14, title: "S2b：Visionが二段階で範囲を絞る", detail: "広く探すPass 1と、拡大して確かめるcrop zoom。", metric: "PASS 1 → CROP ZOOM", mode: "sheet"},
  {...ai, index: 15, title: "crop zoomで、14件中12件を受入", detail: "全14件を検出。中心誤差とIoUを測り、採択基準で判定した。", metric: "12 / 14 ACCEPTED", mode: "sheet"},
  {...ai, index: 16, title: "S3：計画し、取得し、組み立てる", detail: "計画LLMの出力を、引用と取得結果に接地して構成する。", metric: "PLAN → RESOLVE → COMPOSE", mode: "sheet"},
  {...ai, index: 17, title: "証跡つきシートが、レビューへ届く", detail: "見栄えだけでなく、出典をたどれる一枚として渡す。", metric: "GROUNDING FIRST", mode: "sheet"},

  {...data, index: 18, title: "資料管理官データ、架空企業を整える", detail: "デモA株式会社の監査・経理資料を、現実的な複雑さでそろえる。", mode: "data"},
  {...data, index: 19, title: "J-SOX、53統制の評価世界", detail: "全社、業務、IT、決算の統制を一つのデータセットへ。", metric: "53 CONTROLS", mode: "data"},
  {...data, index: 20, title: "真の不備、判断保留、軽微な例外", detail: "機械的に白黒をつけず、異なる判断状態を意図的に混ぜる。", metric: "3 JUDGMENT STATES", mode: "data"},
  {...data, index: 21, title: "4社の連結パッケージを回収", detail: "製造、物流、在外、非完全子会社。様式の違いも残す。", metric: "4 COMPANIES", mode: "data"},
  {...data, index: 22, title: "照合・換算・消去・連結財務諸表", detail: "回収状況から連結精算表まで、一連の決算業務を再現する。", metric: "RECONCILE → CONSOLIDATE", mode: "data"},
  {...data, index: 23, title: "数字はPythonモデルで機械検算", detail: "貸借、利益剰余金、キャッシュフローのつながりを自動で確かめる。", metric: "SINGLE SOURCE OF TRUTH", mode: "data"},

  {...twin, index: 24, title: "検証官ツイン、会社の分身を起動", detail: "規程と仕事の流れを持つ模擬会社で、統制の働きを観察する。", mode: "twin"},
  {...twin, index: 25, title: "20場面から60の分岐世界へ", detail: "同じ出発点から、操作を変えた複数の未来を並行して走らせる。", metric: "20 SCENES × 60 WORLDS", mode: "twin"},
  {...twin, index: 26, title: "逸脱を一手だけ差し込み、先を観察", detail: "実験者の操作と社員の行動を区別し、因果の境界を残す。", metric: "ONE DEVIATION", mode: "twin"},
  {...twin, index: 27, title: "世界の事実はハッシュで連鎖", detail: "何が起き、誰が動き、何を根拠に判定したかを追跡可能にする。", metric: "HASH-CHAINED LEDGER", mode: "twin"},
  {...twin, index: 28, title: "拒否27、契約到達10、停止6、未決17", detail: "通った経路も、止まった経路も、決着しない経路も同じ粒度で残す。", metric: "27 / 10 / 6 / 17", mode: "twin"},
  {...twin, index: 29, title: "止めたのは、規程を引用した人", detail: "制御はシステムだけではない。人の判断が最後の防波堤になる。", metric: "HUMAN + POLICY", mode: "twin"},
  {...twin, index: 30, title: "穴を見つけても、網羅性は誇張しない", detail: "一度でも再現した経路は報告する。ただし完全な予測とは呼ばない。", metric: "EVIDENCE, NOT ORACLE", mode: "twin"},
  {...twin, index: 31, title: "実験の証跡が、次の検査設計を鍛える", detail: "再現手順と判定根拠を残し、次の分岐へ知見を渡す。", metric: "OBSERVE → IMPROVE", mode: "twin"},

  {...vio, index: 32, title: "映像編集者ビオ、複雑さを物語へ", detail: "技術の詳細を失わず、初めて見る人が追える順序へ並べる。", mode: "edit"},
  {...vio, index: 33, title: "8秒の断片に、ひとつの論点を置く", detail: "短い単位を積み上げ、約5分の流れをつくる。", metric: "38 × 8 SEC", mode: "edit"},
  {...vio, index: 34, title: "ナレーション・図解・BGMを同期", detail: "章をまたぐ音声は切らず、映像だけを8秒ごとに更新する。", metric: "ONE TIMELINE", mode: "edit"},
  {...vio, index: 35, title: "技術の中身を、人が理解できる形へ", detail: "説明できることまで含めて、開発の成果にする。", metric: "CODE → STORY", mode: "edit"},

  {...outro, index: 36, title: "5人の仕事は、一本のループになる", detail: "それぞれの成果が、次の住人の入力になる。", mode: "council"},
  {...outro, index: 37, title: "記録 → 設計 → データ → 検証 → 説明", detail: "戻ってきた学びは、また次の日の記録へ。", metric: "LEARNING LOOP", mode: "council"},
  {...outro, index: 38, title: "次の朝、街はまた一段賢くなる", detail: "5分04秒、38本の8秒シーンを接続した実験。", metric: "304.00 SEC / COMPLETE", mode: "city"},
];

export const SCENE_DURATION = 192;
export const REPOSITORY_CITY_DURATION = repositoryScenes.length * SCENE_DURATION;
