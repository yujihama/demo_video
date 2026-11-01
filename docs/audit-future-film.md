# 監査の、その先へ — 不正検知モデルの将来像

## v4（2026-10-28、現行版）：タッチと音声の操作、クライアント報告まで

v3の物語（監査人の一日 → AIとの対話 → 深掘り → チーム共有 → パートナー承認 → 翌朝）を保ったまま、操作をタッチと音声「風」に変え、終盤にパートナーがクライアント役員に示唆を報告する場面を加えた。約89.2秒、12カット、1920×1080・24fps（初稿は96.5秒・14カット。2026-10-28の修正でP5承認カットと末尾のP8タブレット挿入を外し原稿05・09・10を差し替え、2026-11-01の修正で冒頭を「特徴量のグラフなし／グループ各社のスコア一覧→会社を選択→AIが根拠を説明」に作り替え、原稿01〜04を差し替えた）。

- **操作と世界観**：机上の大判フラット画面を約20度寝かせた製図台型のタッチディスプレイ、机に平置きのタブレット、縁のない壁面表示。キーボード・マウス・紙はない。年度は2030年3月期。人物は声を出さず、口元が見えない構図で「話しかけている」ことを示し、画面側の細い線（聞く＝波打つ、考える＝呼吸、答える＝一定、完了＝沈む）とライブ文字起こしで会話を表現する。AIの音声は入れない。
- **AIの描き方**：夜間の自律再分析の要約、文字起こし中に先に並ぶ参照候補、分析計画の提示→監査人の「実行」→3エージェントの並列実行、根拠タップで契約書の該当箇所、反実仮想の見積り、壁面のAI議事メモ、承認時の判断理由が翌朝「学習に反映」される流れ。
- **構成**（ハードカット基調、時間経過のみ12フレームのクロスフェード）：V4Hook（3秒、20の光点が5×4の会社タイルに収束）→ P1 朝のタッチ：20社のスコア一覧で会社のタイルに触れ、ポップアップの「AIに説明を求める」に触れる（原稿01）→ S2 AIによるスコアの説明：会社の概要・モデルの説明（不正事例12万件を学習）・モデルが注目した兆候3点を文章で、最後に質問候補（P1内で開いた続きから216フレーム、原稿02）→ P2 肩越しの対話 → S3 AIの回答（原稿03）→ S4 論点と自律分析（原稿04）→ P3 タブレットから大画面へ3件スワイプ（2面合成＋飛ぶカード）→ S5 深掘り（原稿06）→ P4 壁面へ共有（原稿05）→ S6 成果物（原稿07）→ P6 翌朝の無人デスク（原稿09）→ P7 役員会議室で報告（原稿10。口元が動く後半は不使用で136フレームを使い、最後の24フレームを半速に伸ばして160フレーム＝6.7秒。`build.py` のカット項目 `play` で指定）。初稿にあった P8 役員のタブレット挿入（3秒）は修正で削除。
- **画面**：`end-card/src/audit-future-v4/`。2026-11-01の修正で `group.tsx`（20社のタイル GroupGrid）を追加し、ScreenTop・Hook・ScreenNext からヒストグラムを、旧 ScreenDrilldown（科目区分のSHAP内訳・指標・推移グラフ）を ScreenExplain（AIの文章による説明）に置き換えた。ハイブリッド配色（人の作業面は明るく、AIの領域は濃紺にティールの細い線）。共通部品 BreathLine／TouchRing／useTranscript／Presence／StatusLight（`anim.tsx`、`ui.tsx`）。仕草に合わせるフレームは `timing.ts` に集約。対話・深掘り・成果物は384フレームで1本を作り、人物カットとフル画面カットで前半・後半を分けて使う。
- **人物**：開始フレーム8枚はユーザー作成（`production/audit_future_v4/reference_prompts.md`）。H3で各8秒を生成し、`clipsheet.py` と肌色追跡で指の位置・タイミングを読み取ってから画面側を合わせた。
- **合成**（`composite.py`）：透視変換、画面色キー（小さな非画面領域は反射とみなす、画面側を手の中へ数ピクセル広げる）、四隅を外側へ広げるexpand、画面光のスピル、2面合成、タブレット→大画面の飛ぶカード。四隅は `corners.py` で生成クリップ上に線フィット。
- **組立**（`build.py`）：可変尺のカット表、合成したUI音（タップ・スワイプ・到着・チャイム・送信・AIのハム）、環境音、ナレーション中のBGM自動ダッキング、全フレーム共通の色グレード（弱いS字、ティール寄りの影と暖色の光、ビネット、粒状感）。
- **ナレーション**：10行を一括収録（gpt-4o-mini-tts / cedar）、原稿05と06の順序を入れ替え、原稿10「得られた示唆は監査にとどまらず、クライアントの経営にも届けられます。」を追加。修正版では原稿05「発見事項はすぐにチームに共有されます。」、原稿09「監査人とのやり取りや評価結果の履歴は蓄積され、今後の監査においてAIが活用できるようになります。」（10%速め）、原稿10「得られた示唆をもとに監査が行われ、クライアントの経営陣にも届けられます。」（6%速め）に差し替え、2026-11-01に原稿01「監査人の一日は、グループ各社の不正リスクスコアの確認から始まります。」、02「大量の不正事例を学習した機械学習モデルがスコアを算出し、会社を選ぶとAIが根拠を説明します。」（10%速め）、03「監査人の問いに、AIは投入された資料を参照して答え、根拠となる箇所も示します。」、04「対話を通じて論点と追加の確認事項を整理し、分析や資料の探索を自律的に進めます。」（8%速め）に差し替え（テイク4、以前のテイクは `audio_take3/`）、原稿08はP5カットごと不使用（音声は `audio/nar08.wav` に残置）。同日の再改訂（テイク5、以前のテイクは `audio_take4/`）で全11行に振り直し、人物シーンP2・P3にも当てた：01「監査人はまず、各子会社のリスクスコアを確認します。」02「大量の不正事例を学習した機械学習モデルがスコアを算出し、AIがその根拠を説明します。」03（P2・新規）「監査人は、気になった点をそのままAIに問いかけます。」04「AIは、スコアの根拠に関連する箇所を、投入された資料から探してハイライトすることもできます。」05「対話を通じて論点と追加の確認事項を整理し、分析の実行を指示します。」06（P3・新規）「分析や資料の探索はAIが自律的に進め、結果は手元でも確認できます。」07（旧06）、08「発見事項はすぐにチームに共有され、次の手続を話し合います。」09（旧07）、10（旧09）、11（旧10）。テイク5は早回しなし（全行7秒以内）。分割結果は各行を文字起こし（gpt-4o-mini-transcribe）して原稿と照合した。行の切り出しは文字数比で境界を選ぶ方式に変更（`generate_narration.py`）。初稿の音声は `audio_take1/`、05・09差し替え時のテイクは `audio_take2/`。
- **出力**：`end-card/demo/audit_future_v4_high.mp4`（修正版、2,140フレーム・89.2秒）、`audit_future_v4_high_web.mp4`（共有用18MB）、`audit_future_v4_high_720p_preview.mp4`、マニフェスト。初稿（96.5秒）は `production/audit_future_v4/revisions/audit_future_v4_high_take2.mp4`。
- **再現**：画面 `end-card> .
ode_modules\.bin
emotion.cmd render src/audit-future-v4/index.ts <V4Top|V4Drilldown|V4Ask|V4Issues|V4Tablet|V4Deepen|V4Wall|V4Outputs|V4Next|V4Report|V4ReportTablet|V4Hook> ../production/audit_future_v4/screens/<id>.mp4 --codec=h264 --crf=16` → 人物 `generate.py --res high --start 1 --end 8` → 四隅 `corners.py` → 合成 `composite.py`（設定は `composite_plan.json`）→ 組立 `build.py --cut cut_v5.json --out end-card/demo/audit_future_v4_high.mp4（初稿は cut_final.json、cut_v2〜v4 は中間版）` → 検証 `validate.py --path ...`。

## v3（2026-10-26）：具体的な不正検知画面を監査人が操作する

v2の派生。要望は「画面は空間UIではなく大画面PCモニター」「不正検知モデルの画面に現実感のある具体性（日本語UI）」「監査人が実際に操作する」。

- **方式**：アプリ画面はRemotionで実装（`end-card/src/audit-future-v3/`、日本語UI、架空データ）し1080pで直接レンダリング。人物ショットはユーザー作成の開始フレーム（モニター画面は暗い無地・平面）からMiniMax H3で生成（カメラ固定）。人物ショットのモニター四隅に画面クリップを透視変換で合成（`production/audit_future_v3/composite.py`、前景の人物は画面色キーで残す）。画面フルのカットと人物（合成）カットを交互に配置。
- **H3に画面を描かせる検証**は不採用（`production/audit_future_v3/revisions/h3_ui_test/`）。操作の動きは再現できたが、小さな文字は崩れ、遷移後の画面は架空の文字列になった。
- **構成**（10シーン×8秒、0.5秒クロスフェード、75.5秒、1,812フレーム）：P1 朝モニター前（ダッシュボード合成）→ S2 ドリルダウン → P2 横顔とキーボード（AIに質問を合成）→ S3 AIに質問 → S4 論点管理・自律分析 → P3 壁面モニター前の3人（追加資料画面を合成）→ S5 追加資料と深掘り → S6 成果物ドラフト → P4 パートナーの承認（成果物画面を合成）→ P5 翌朝の無人デスク（更新されたダッシュボードを合成）。
- **画面**：S1 分布（ヒストグラム＋上位一覧、クリック）／S2 科目区分の内訳と指標（区分選択→AIに質問）／S3 AIの背景説明（参照元、推測される背景、契約書該当箇所）／S4 論点・自律分析の進行・クライアント確認事項／S5 受領資料の投入・更新分析・同業比較・経営指標・AIの示唆／S6 追加手続案・調書メモ・会社報告ドラフト／S7 翌朝のダッシュボード（87→71、判断履歴の蓄積）。
- **ナレーション**：9行を一括収録（`production/audit_future_v3/narration.json`、`audio/`）、各シーン開始0.5秒後。人物シーンP2には当てず、画面シーンS3に合わせた。
- **出力**：`end-card/demo/audit_future_v3_high.mp4`（1080p）、`audit_future_v3_high_720p_preview.mp4`。検証：1,812フレーム完全デコード、音声75.52秒、ピーク0.878、黒画面なし。
- **制作ファイル**：`production/audit_future_v3/`（plan.md、reference_prompts.md、scene_plan.json、narration.json、generate.py、build.py（カット表方式）、composite.py、composite_plan.json、cut_final.json、validate.py、screens/、clips/high/、composite/、qc/、final_qc/）。
- **再現**：画面 `end-card> .\node_modules\.bin\remotion.cmd render src/audit-future-v3/index.ts V3Top ../production/audit_future_v3/screens/V3Top.mp4 --codec=h264 --crf=16`（V3Drilldown/V3Ask/V3Issues/V3Deepen/V3Outputs/V3Next も同様）→ 人物 `generate.py --res high --start 1 --end 5` → 合成 `composite.py --person ... --ui ... --out ... --start <四隅> --end <四隅> --opacity 1.0 --darken 0.86 [--key 48]` → 組立 `build.py --cut cut_final.json --out end-card/demo/audit_future_v3_high.mp4` → 検証 `validate.py --path ...`。

## v2（2026-10-25）

v1のレビューで「前作の参照画像の流用で未来感がない」「うなずくだけのシーンや似た構図が冗長」「エンディングは不要」と指摘を受け、v2として作り直した。

- 8シーン×8秒、0.5秒クロスフェード、エンディングカードなし、約60.5秒（1,452フレーム、24fps、1920×1080）。
- 開始フレームはすべて新規。scene01〜07はユーザーがOpenAIの画像モデルで作成（プロンプトは `production/audit_future_v2/reference_prompts.md`）。scene08はシーン7の最終フレームから継続生成。
- 世界観：近未来（2032年頃）のガラス張りオフィス、暗いネイビーの大型ガラスディスプレイ、浮遊する空間UI、青緑のネットワーク図と琥珀の強調。紙はなし。人物は40歳前後の男性監査人（眼鏡、白シャツ襟にチャコールのニット）、女性同僚（チャコールのジャケット）、年配の男性パートナー（紺のスーツ）。
- 各シーンの主張：1 俯瞰（3Dネットワーク図、1社が琥珀）／2 根拠（カード展開と知識の層）／3 文字での対話／4 証拠の該当箇所／5 人が決め、調書に紐づく／6 タブレットから壁一面へ共有／7 論点ボードとAIの記録／8 承認から翌朝の更新へ。
- 制作ファイル：H3ワークスペース直下の `production/audit_future_v2/`（scene_plan.json、narration.json、generate.py、build.py、validate.py、references/、clips/high/、qc/high/）。このリポジトリには同フォルダの抜粋を `end-card/production/audit_future_v2/` として収録している（参照画像、生成プロンプト、ComfyUIグラフ、生成クリップ、ナレーション音声、QC画像、検証結果、各スクリプト）。スクリプトはワークスペース直下の `production/` に置いて実行する前提で、退避した第1テイク（revisions/）と各フレームのQC画像は含めていない。
- 出力：`end-card/demo/audit_future_v2_high.mp4`、確認用 `audit_future_v2_high_preview02.mp4`（先頭2シーン）。
- 高画質直行（864×480・20 steps、1本約12.5〜15.5分）。ラフ版は作っていない。
- ナレーション（第2テイク）：文体を「です・ます」に統一した原稿をユーザーが確定。8行を1本の原稿として一度に合成し（`generate_narration.py`、行間に間を置く指示）、無音区間で分割して各シーン開始0.5秒後に配置。音量は全行を合わせた一つのゲインで正規化。全行7.3秒以内、話速の平均からのずれは短い6行目（+19%）を除き±15%以内。第1テイクの音声・原稿・映像は `production/audit_future_v2/revisions/` に保存。

以下はv1の記録。

## 映像の構成（v1）

約105秒。一人の監査人の一日として、朝の俯瞰（子会社別リスクスコア）→ AIとの文字対話による深掘り → 同僚との大型スクリーンでの検討と記録 → 翌朝の更新、と進む。
製品紹介ではなく、監査人の仕事の高度化を見せることが目的。
登場人物は一切話さない。語りはナレーション1名のみ。エンディングに法人名・ロゴは入れない。

## 発話と映像の関係

- 監査人（男性、眼鏡、白シャツ・紺ネクタイ）と同僚（女性、チャコールのジャケット）は、見る・うなずく・指差す・タイプする・タブレットをタップするだけ。
- 顔を見せるのはシーン4・7・8・11のみ。いずれも口を閉じたまま。
- 生成クリップの音声は使わず、ナレーションと小音量のBGMを別に配置する。
- 画面内の文字・数値は読めない抽象表現。実在の製品UIは映さない。

## 内容上の前提

子会社別リスクスコアを確認する架空の監査シナリオ。スコアは確認優先度の手掛かりであり、不正の確率や断定ではない。
知識空間（シーン3）は監査知見の蓄積と照合の概念表現であり、実際のモデル内部ではない。
会社名・数値・資料・対話はすべて架空。

## 制作ファイル

- [シナリオ](../../production/audit_future_v1/scenario.md)
- [生成プロンプト](../../production/audit_future_v1/scene_plan.json)
- [ナレーション台本](../../production/audit_future_v1/narration.json)
- [動画生成](../../production/audit_future_v1/generate.py)（`--res low|high`、再開・再試行対応）
- [ナレーション生成](../../production/audit_future_v1/generate_narration.py)
- [編集・合成](../../production/audit_future_v1/build.py)
- [検証](../../production/audit_future_v1/validate.py)
- 参照画像：`production/audit_future_v1/references/`（前作 audit_digital_v2 / audit_knowledge の人物・オフィス・知識空間を流用）

## 再現手順

作業ディレクトリはH3ワークスペース直下。ComfyUIが127.0.0.1:8188で稼働し、他の生成キューが空であること。

```powershell
.\ComfyUI_windows_portable\python_embeded\python.exe production\audit_future_v1\generate.py --res low --start 1 --end 12
.\ComfyUI_windows_portable\python_embeded\python.exe production\audit_future_v1\generate_narration.py
.\ComfyUI_windows_portable\python_embeded\python.exe production\audit_future_v1\build.py --res low
.\ComfyUI_windows_portable\python_embeded\python.exe production\audit_future_v1\validate.py --res low
```

高画質版は `--res high`（864×480・20 steps、1本約12〜13分）。シーンを撮り直す場合は該当クリップと `generation_manifest_{res}.json` の項目を `revisions/` へ退避し、`--seed-offset` を変えて該当シーンだけ再生成する。
ポーリング中に接続が切れても、`active_{res}.json` に送信済みのprompt_idが残っていれば次回起動時に回収する。

## 出力仕様

- ラフ版：MiniMax H3 608×352・12 steps → `end-card/demo/audit_future_v1_low.mp4`
- 高画質版：MiniMax H3 864×480・20 steps → `end-card/demo/audit_future_v1_high.mp4`
- いずれも16:9に中央クロップし、1920×1080・24fps・H.264/AACで書き出し。2,520フレーム、105.0秒。
- シーン構成：12本×192フレーム（12フレームのクロスフェード）＋エンディング360フレーム（前作のオフィス背景を往復再生し、暗く落として文字を重ねる）。
- ナレーション：gpt-4o-mini-tts / cedar。各シーン開始0.5秒後、エンディングは開始1.0秒後に配置。
- BGM：`end-card/public/accounting-future-v3/bgm.wav` をループ、-34 dBFS RMS、末尾4秒フェード。

## 制作記録（2026-10-25）

- ラフ版12本：1本あたり約250秒（初回のみモデル読込を含め約30秒＋待機）。高画質版12本：1本あたり約740〜800秒。
- 高画質版シーン9・10は、ラフ版で拡大カードに大きな数字が描かれたため「数字を描かない」をプロンプトに加えて生成。
- 高画質版シーン11は初回に同僚の口が開くコマが多かったため、「唇を閉じたまま無言」を強調し別シード（+7）で撮り直し。初回は `production/audit_future_v1/revisions/` に保存。
- ラフ版の検証：2,520フレーム完全デコード、音声105.003秒、ピーク0.869、途中の黒画面なし。
- 高画質版の検証：2,520フレーム完全デコード、1920×1080、音声105.003秒、ピーク0.869、途中の黒画面なし（`production/audit_future_v1/final_qc/high/validation.json`）。
- 注意：864×480は16:9よりわずかに横長なため、前作の「高さを切る」切り出しでは3行しか残らず映像が縦縞に崩れた。`build.py` の `clip_frames` は幅・高さのどちらを切るかを判定し、853×480に中央クロップしてから1080pへ拡大する。
- 720p圧縮コピー（共有用）：`end-card/demo/audit_future_v1_{low,high}_720p_preview.mp4`
