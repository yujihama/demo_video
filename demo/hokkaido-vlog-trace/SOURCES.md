# 北海道・架空旅行Vlog — 参照画像と生成トレース

この映像は架空の旅程です。各8秒シーンは、Wikimedia Commons上の実在写真1点を開始フレームとして、ローカルのMiniMax H3 image-to-videoで生成しました。映像内の `REF-XX` と下表の番号が対応します。

## 再現条件

- 構成: 15シーン × 8秒 = 120秒
- H3入力: 各参照写真を中央トリミング後、608×352 PNGに固定
- H3出力: 608×352、24fps、192フレーム、12 steps、simple scheduler、res_multistep sampler
- 編集出力: Remotionで1280×720へ配置し、ナレーション、BGM、字幕、出典表示を合成
- 本映像のライセンス表示: CC BY-SA 4.0（下表の各原著作者への帰属を含む）
- 完全なプロンプト、入力/出力SHA-256、ComfyUI prompt ID、処理時間、リソース計測値は同梱JSONを参照

## シーン別トレース

| REF | 場所 | 実在写真（Wikimedia Commons） | 作者 | ライセンス | 入力SHA-256 | H3出力SHA-256 |
|---:|---|---|---|---|---|---|
| REF-01 | 札幌・大通公園 | [Hokkaido Sapporo Odori Park.jpg](https://commons.wikimedia.org/wiki/File:Hokkaido_Sapporo_Odori_Park.jpg) | Nkns | [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) | `f269de154c2dc38a…` | `c1852009b1a6a905…` |
| REF-02 | 札幌・時計台 | [Sapporo Clock Tower 130.JPG](https://commons.wikimedia.org/wiki/File:Sapporo_Clock_Tower_130.JPG) | Ninosan | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) | `27a0daf650658f46…` | `141e55c4434a027e…` |
| REF-03 | 札幌・二条市場 | [Nijo fish Market 2014.jpg](https://commons.wikimedia.org/wiki/File:Nijo_fish_Market_2014.jpg) | Wing1990hk | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | `e505d4695b8b9250…` | `fe231e03ff990ca8…` |
| REF-04 | 小樽・運河 | [Otaru Canal Dusk in summer.jpg](https://commons.wikimedia.org/wiki/File:Otaru_Canal_Dusk_in_summer.jpg) | Sho Horiuchi | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | `b9999237c23909be…` | `c39bd24d043df73f…` |
| REF-05 | 小樽・堺町通り | [Sakaimachi street Otaru Hokkaido04bs3.jpg](https://commons.wikimedia.org/wiki/File:Sakaimachi_street_Otaru_Hokkaido04bs3.jpg) | 663highland | [CC BY 2.5](https://creativecommons.org/licenses/by/2.5) | `c02925d73735f993…` | `d8443092f495c6fb…` |
| REF-06 | 札幌・藻岩山 | [Japan Sapporo Mt.Moiwa 0049.jpg](https://commons.wikimedia.org/wiki/File:Japan_Sapporo_Mt.Moiwa_0049.jpg) | Ermell | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | `7db84dac33df813d…` | `07f4c1ac61bd0e09…` |
| REF-07 | 美瑛・白金青い池 | [Shirogane Blue Pond, Biei, Hokkaido Japan.jpg](https://commons.wikimedia.org/wiki/File:Shirogane_Blue_Pond,_Biei,_Hokkaido_Japan.jpg) | AndyLeungHK | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) | `ed1bf38afdd4a985…` | `5ed3c4826812eb2c…` |
| REF-08 | 美瑛・四季彩の丘 | [Shikisai-no-oka.jpg](https://commons.wikimedia.org/wiki/File:Shikisai-no-oka.jpg) | lumoplank | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) | `25133b2665064e9a…` | `0957565b277f3820…` |
| REF-09 | 富良野・ファーム富田 | [Furano Lavender FarmTomita.jpg](https://commons.wikimedia.org/wiki/File:Furano_Lavender_FarmTomita.jpg) | Kentagon | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | `726a4746c3d3d739…` | `4148fddde9eed1cb…` |
| REF-10 | 富良野・ラベンダーソフト | [Lavender soft serve at Farm Tomita.jpg](https://commons.wikimedia.org/wiki/File:Lavender_soft_serve_at_Farm_Tomita.jpg) | Douglas Perkins | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | `d05dbdf042a494d5…` | `81a199ab795adb20…` |
| REF-11 | 登別・地獄谷 | [Jigokudani (Hell Valley), Noboribetsu Onsen, Hokkaido, April 2023 05.jpg](https://commons.wikimedia.org/wiki/File:Jigokudani_(Hell_Valley),_Noboribetsu_Onsen,_Hokkaido,_April_2023_05.jpg) | Calistemon | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | `47dc881a62c6c19c…` | `b3f3ed1a46a26e01…` |
| REF-12 | 洞爺湖 | [Lake Toya 20140807.jpg](https://commons.wikimedia.org/wiki/File:Lake_Toya_20140807.jpg) | Suicasmo | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | `e8750b9237a7fad7…` | `5d13e62b2fb287b1…` |
| REF-13 | 函館・朝市 | [Hakodate Morning Market, Hakodate Asaichi, Hakodate, 2014.jpg](https://commons.wikimedia.org/wiki/File:Hakodate_Morning_Market,_Hakodate_Asaichi,_Hakodate,_2014.jpg) | bryan... | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | `7e0b07fff7aba48a…` | `395621d6696c871c…` |
| REF-14 | 函館・元町 | [Motomachi Catholic Church in Hakodate Hokkaido Japan01n.jpg](https://commons.wikimedia.org/wiki/File:Motomachi_Catholic_Church_in_Hakodate_Hokkaido_Japan01n.jpg) | 663highland | [CC BY 2.5](https://creativecommons.org/licenses/by/2.5) | `df064984f194d6fc…` | `54379f7c90d68c24…` |
| REF-15 | 函館山 | [Mount-Hakodate Night-view.jpg](https://commons.wikimedia.org/wiki/File:Mount-Hakodate_Night-view.jpg) | MaedaAkihiko | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | `aab8aac800c1626e…` | `3302f32850952bca…` |

## 同梱ファイル

- `scene_plan.json`: 物語、画面タイトル、ナレーション文、H3プロンプト
- `SCENARIO.md`: 00:00から02:00までの場面、ナレーション、REF対応表
- `reference_manifest.json`: Commonsメタデータ、取得URL、作者、ライセンス、元画像/加工画像ハッシュ、クロップ座標
- `generation_manifest.json`: prompt ID、seed、steps、出力ファイル、出力ハッシュ、映像仕様、VRAM/RAM計測値
- `references/source/`: Commonsから取得した参照画像
- `references/prepared/`: H3へ実際に入力した608×352画像

## 利用上の注意

本資料は出典確認をしやすくするための制作トレースであり、法的助言ではありません。BY-SA素材を含むため、映像を公開・再配布する際は各ソースのライセンス条件を再確認し、この帰属情報と必要なライセンス表示を維持してください。AI生成部分は参照写真を変形した二次的表現を含みます。
