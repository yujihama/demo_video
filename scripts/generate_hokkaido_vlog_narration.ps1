param(
  [string]$EnvPath = "..\.env.local",
  [string]$OutputDir = ".\public\hokkaido-vlog\audio"
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
    Text = "北海道、季節をまたぐ架空の三日間。雪の札幌、大通公園からスタートします。時計台の入口まで歩くと、街の真ん中だけ、時間が少しゆっくりに。二条市場では、朝から海の匂い。最初の寄り道が、もう正解です。"
  },
  @{
    File = "narration-02.wav"
    Text = "電車で小樽へ。運河沿いは、水と石の色までゆっくりでした。堺町通りは、古い建物と小さな店が続いて、歩くほど楽しい。札幌へ戻り、藻岩山から一日を見渡します。街が旅の地図みたい。"
  },
  @{
    File = "narration-03.wav"
    Text = "二日目は美瑛の青い池。静かな水の色だけで、朝の眠気が消えました。四季彩の丘では、色の帯が地平線まで続きます。富良野のラベンダー。風が吹くたび、紫が波のように動きます。"
  },
  @{
    File = "narration-04.wav"
    Text = "休憩はラベンダーソフト。見た目よりすっきりで、夏の味。南へ走って登別。地獄谷の湯気に近づくと、地面が呼吸しているよう。洞爺湖では、景色の音量が急に下がります。しばらく、何もしない時間。"
  },
  @{
    File = "narration-05.wav"
    Text = "三日目、函館朝市。海鮮を選ぶ声で、港の朝が始まります。元町の坂と教会へ。海風の中に、異国の輪郭が残っていました。最後は函館山。光のくびれを眺めて、架空の三日間を閉じます。"
  }
)

$instructions = @"
日本語の旅行Vlogとして、親しい友人に旅を話すような、自然で明るく落ち着いた声で読んでください。
観光案内のように大げさにせず、景色を見つけた瞬間の小さな驚きと余韻を含めます。
意味のまとまりで滑らかにつなぎ、地名は明瞭に発音します。文と文の間には短い自然な呼吸を置きます。
全体を二十一秒から二十三秒程度に収めるテンポで、早口にはしないでください。
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
