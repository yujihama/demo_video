param(
  [string]$EnvPath = "..\.env.local",
  [string]$OutputDir = ".\public\repository-city-5min"
)

$ErrorActionPreference = "Stop"

$resolvedEnv = Resolve-Path $EnvPath
$apiKeyLine = Get-Content -LiteralPath $resolvedEnv | Where-Object { $_ -match '^OPENAI_API_KEY=' } | Select-Object -First 1
if (-not $apiKeyLine) {
  throw "OPENAI_API_KEY was not found in $resolvedEnv"
}
$apiKey = ($apiKeyLine -split '=', 2)[1].Trim().Trim('"').Trim("'")
if (-not $apiKey) {
  throw "OPENAI_API_KEY is empty"
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$chapters = @(
  @{
    File = "narration-01.wav"
    Text = "午前零時。人が眠りにつくころ、リポジトリ街では、今日の変更が静かに動き始めます。ここに暮らすのは、直近で更新された五つのリポジトリ。それぞれ別の仕事を持ちながら、記録、設計、データ、検証、そして説明を、ひとつの循環へつないでいます。今夜は、その住人たちの仕事をのぞいてみましょう。"
  },
  @{
    File = "narration-02.wav"
    Text = "最初は、記録係のミオです。毎朝六時、日次レビューの白紙を用意し、入力したニュースや学び、思いついたアイデア、終えたタスクを、迷子にならない場所へ並べます。ここでは、プルリクエストそのものが仕事の足跡です。何を始め、何を終え、どんな判断をしたのか。今日の行動が履歴として残るから、週末の振り返りは記憶頼みになりません。ミオの仕事は地味に見えて、街全体の時間をつなぐ基礎になっています。"
  },
  @{
    File = "narration-03.wav"
    Text = "次は、設計士のアイ。彼女の机には、PDF、CSV、Excel、画像が次々と届きます。目標は、散らばった証跡を、レビューできる一枚のエビデンスシートへ変えること。まずエスワンが、要素の契約とドローイングエムエルによる描画の土台をつくります。次にエスツーが、文書や表から必要な箇所を決定的に取得します。見つからない範囲を、それらしく推測することはしません。未解決として警告し、人に判断を返します。画像では、ビジョンが広く探す一回目と、拡大して確かめる二回目を分けて範囲を特定。直近の精度検証では、十四件すべてを検出し、十二件が受入基準を満たしました。そしてエススリーが、何をどこに置くかを計画し、取得結果と引用を結び、シートへ組み立てます。派手な一枚の裏には、推測を避け、根拠を落とさないための小さな約束が、何層にも積み重なっています。"
  },
  @{
    File = "narration-04.wav"
    Text = "その設計を試すには、現実に近い資料が必要です。資料管理官のデータが守るのは、架空の上場製造業、デモA株式会社。販売、購買、在庫、IT、決算まで、五十三の統制と評価資料がそろっています。中には、真の不備、追加証跡が必要な判断保留、業務影響の小さい例外も、意図的に混ぜられています。さらに直近では、四社の連結パッケージを回収し、内部取引の照合、在外子会社の換算、消去仕訳、連結精算表、連結財務諸表までを追加しました。数字のつながりは、パイソンモデルを一つの正本として機械検算。物語のためのデータでも、都合よく数字を曲げない。それがデータの流儀です。"
  },
  @{
    File = "narration-05.wav"
    Text = "資料がそろうと、検証官ツインが会社の分身を起動します。通常の仕事が進む世界に、実験者が逸脱を一手だけ差し込み、その後の社員や顧客の行動を観察します。直近の広域実行は、二十の場面から六十の分岐世界をつくりました。全ての事実は一行ずつ記録され、ハッシュで連鎖します。結果は、システムが拒否した世界が二十七。逸脱が通って契約まで到達した世界が十。途中で止められた世界が六。期間内に決着しなかった世界が十七でした。興味深いのは、止まった世界では、いずれも人が規程を引用して制止していたことです。ただし、ツインは一度の実験を完全な答えとは呼びません。見つけた経路を記録と再現手順つきで示し、網羅性や将来予測を誇張しない。検証可能な小さな発見を重ね、次の検査設計を鍛えていきます。"
  },
  @{
    File = "narration-06.wav"
    Text = "最後に、映像編集者のビオが受け取ります。設計や検証がどれほど優れていても、仕組みを知らない人に伝わらなければ、次の判断にはつながりません。ビオは複雑な技術を八秒の断片へ分け、ひとつの画面には、ひとつの論点だけを置きます。ナレーション、図解、音楽を同じ時間軸に並べ、技術の中身を削らずに、初めて見る人にも追える物語へ変えていきます。"
  },
  @{
    File = "narration-07.wav"
    Text = "記録係が昨日を残し、設計士が証跡を整え、資料管理官が現実を支え、検証官が穴を探し、映像編集者が意味を届ける。五人の仕事は、ばらばらなツールではなく、学び続ける一本のループです。次の朝、リポジトリ街は、また一段だけ賢くなっています。"
  }
)

$instructions = @"
日本語の企業向けドキュメンタリーとして、落ち着き、知性、自然な温かさのある声で読んでください。
機械的に一語ずつ区切らず、意味のまとまりで滑らかにつなぎます。数字は明瞭に、列挙は単調にならないようにします。
過度に芝居がかった抑揚は避け、重要な結論だけをやや強調してください。文と文の間には短い自然な呼吸を置きます。
"@

foreach ($chapter in $chapters) {
  $body = @{
    model = "gpt-4o-mini-tts"
    voice = "cedar"
    input = $chapter.Text
    instructions = $instructions
    response_format = "wav"
  } | ConvertTo-Json -Depth 5

  $outPath = Join-Path $OutputDir $chapter.File
  Write-Host "Generating $($chapter.File)..."
  Invoke-WebRequest `
    -Uri "https://api.openai.com/v1/audio/speech" `
    -Method Post `
    -Headers @{ Authorization = "Bearer $apiKey" } `
    -ContentType "application/json; charset=utf-8" `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) `
    -OutFile $outPath
}

Write-Host "Narration files written to $OutputDir"
