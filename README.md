# 経理業務の未来 — Demo Video

AIエージェントと人が協働する、これからの経理業務を描いた約1分のデモ動画です。

## 完成動画

[accounting_future_1min_final.mp4](demo/accounting_future_1min_final.mp4)

- 長さ: 約59.4秒
- 解像度: 608 × 352
- フレームレート: 24fps
- 音声: 日本語ナレーション、オリジナルBGM
- 構成: 8シーン、0.25秒のクロスフェード

## ストーリー

1. 入力・照合に追われる現在の経理業務
2. 正確さと定型作業の負荷
3. 退勤時にAIエージェントへデータを引き継ぐ
4. 翌朝、人が例外だけを確認する
5. 請求書・入金・仕訳の自動照合
6. 資金繰り・業績変化の予測
7. 経理が経営のビジネスパートナーへ変わる
8. Deloitte Analytics & Digital Governance Technology Teamのエンドカード

詳しい構成とナレーションは [docs/scenario.md](docs/scenario.md) を参照してください。

## ローカルで確認する

Node.jsをインストールした環境で実行します。

```powershell
npm install
npm run dev
```

Remotion Studioで `AccountingFutureFilm` を選択すると、完成動画をプレビューできます。

## 再レンダリング

```powershell
npx remotion render AccountingFutureFilm demo/accounting_future_1min_final.mp4
```

エンドカードだけを書き出す場合:

```powershell
npx remotion render AccountingFutureEndCard demo/accounting_future_end_card.mp4
```

## 主な構成

- `src/full-video/`: 全編のシーン構成、トランジション、音声配置
- `src/Composition.tsx`: 全編およびエンドカードのComposition
- `public/accounting-future/`: 映像クリップ、ナレーション、BGM、エンドカード保持画像
- `public/office-background.mp4`: エンドカード背景
- `public/deloitte.svg`: エンドカード用ロゴ
- `demo/`: レンダリング済み完成動画とプレビュー画像

## 利用上の注意

本リポジトリはデモ制作物です。Deloitteの名称・ロゴを社外向けに利用または再配布する場合は、適用されるブランドガイドラインと承認手続きを確認してください。
