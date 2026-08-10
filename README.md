# 経理業務の未来 — Demo Video

AIエージェントと人が協働する、これからの経理業務を描いた約1分のデモ動画です。

## 5分04秒・8秒シーン接続実験

[repository_city_5min_experiment.mp4](demo/repository_city_5min_experiment.mp4)

- 長さ: 304.00秒（5分04秒）
- 解像度: 1280 × 720
- フレームレート: 24fps
- 構成: 38シーン × 8.00秒
- テーマ: 直近で更新された5つのリポジトリを、リポジトリ街の住人として擬人化
- 音声: PC内蔵の日本語音声によるナレーション、オリジナルBGM

シナリオ、事実確認元、全38シーン、ナレーション原稿は
[docs/repository-city-5min-scenario.md](docs/repository-city-5min-scenario.md) を参照してください。

Remotion Studioでは `RepositoryCity5Min` を選択します。再レンダリング:

```powershell
npx remotion render RepositoryCity5Min demo/repository_city_5min_experiment.mp4 --codec=h264 --crf=20 --audio-bitrate=192k --concurrency=4
```

## 完成動画

[accounting_future_1min_final.mp4](demo/accounting_future_1min_final.mp4)

- 長さ: 約54.5秒
- 解像度: 608 × 352
- フレームレート: 24fps
- 音声: 日本語ナレーション、オリジナルBGM
- 構成: 7シーン、0.25秒のクロスフェード

## ストーリー

1. 入力・照合に追われる現在の経理業務
2. 締め日が近づき、夕方まで残る反復作業
3. 退勤時にAIエージェントへデータを引き継ぐ
4. 夜間や業務の裏側で単純作業を完了する
5. 翌朝、人が判断するのは絞り込まれた例外だけ
6. 分析・予測と経営支援へ役割が変わる
7. Deloitte Analytics & Digital Governance Technology Teamのエンドカード

詳しい構成とナレーションは [docs/scenario.md](docs/scenario.md) を参照してください。

## ローカルで確認する

Node.jsをインストールした環境で実行します。

```powershell
npm install
npm run dev
```

Remotion Studioで `AccountingFutureFilmV3` を選択すると、完成動画をプレビューできます。

## 再レンダリング

```powershell
npx remotion render AccountingFutureFilmV3 demo/accounting_future_1min_final.mp4
```

エンドカードだけを書き出す場合:

```powershell
npx remotion render AccountingFutureEndCard demo/accounting_future_end_card.mp4
```

## 主な構成

- `src/accounting-future-v3/`: 最新版の7シーン構成、トランジション、音声配置
- `src/full-video/`: 以前の全編構成とエンドカード
- `src/Composition.tsx`: 全編およびエンドカードのComposition
- `public/accounting-future-v3/`: 最新版の映像クリップ、再設定したナレーション、BGM
- `public/accounting-future/`: エンドカードと以前の映像素材
- `public/office-background.mp4`: エンドカード背景
- `public/deloitte.svg`: エンドカード用ロゴ
- `demo/`: レンダリング済み完成動画とプレビュー画像

## 利用上の注意

本リポジトリはデモ制作物です。Deloitteの名称・ロゴを社外向けに利用または再配布する場合は、適用されるブランドガイドラインと承認手続きを確認してください。
