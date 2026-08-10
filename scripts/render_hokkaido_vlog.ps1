param(
  [string]$ProductionDir = "..\production\hokkaido_vlog\clips",
  [string]$OutputFile = ".\demo\hokkaido_fictional_vlog_2min.mp4"
)

$ErrorActionPreference = "Stop"
$publicClipDir = ".\public\hokkaido-vlog\clips"
New-Item -ItemType Directory -Force -Path $publicClipDir | Out-Null

if (Test-Path -LiteralPath $ProductionDir) {
  foreach ($number in 1..15) {
    $file = "scene{0:d2}.mp4" -f $number
    $source = Join-Path $ProductionDir $file
    if (-not (Test-Path -LiteralPath $source)) {
      throw "Missing generated H3 clip: $source"
    }
    Copy-Item -LiteralPath $source -Destination (Join-Path $publicClipDir $file) -Force
  }
} else {
  foreach ($number in 1..15) {
    $file = "scene{0:d2}.mp4" -f $number
    if (-not (Test-Path -LiteralPath (Join-Path $publicClipDir $file))) {
      throw "Neither production clips nor packaged public clips are available: $file"
    }
  }
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $OutputFile) | Out-Null
& npx.cmd remotion render HokkaidoFictionalVlog $OutputFile --codec=h264 --audio-codec=aac --crf=18
if ($LASTEXITCODE -ne 0) {
  throw "Remotion render failed with exit code $LASTEXITCODE"
}

Write-Host "Rendered $OutputFile"
