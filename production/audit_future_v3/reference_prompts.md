# audit_future_v3 人物ショット 開始フレーム用プロンプト（OpenAI画像モデル向け）

## 前提（合成方式Bのための条件）
- 画面はあとから合成するので、**モニターの画面は暗い無地（ほぼ黒〜濃紺、反射は弱く）**にする。UIやグラフは描かせない。
- モニターは**平面（湾曲なし）**の大型ワイドディスプレイ（16:9）。**4隅がはっきり見える**構図にする（人物や手で隅を隠さない）。
- 画面が**画面全体の40%以上**を占めるように大きく。斜めすぎない（正面〜30度程度の角度）。
- サイズは 1536×1024。16:9へ中央クロップするので上下6%ずつ切れる前提で、モニターの上下端を画面の端に寄せすぎない。
- scene01を先に作り、以降はそれを参照画像に添えて「同じ人物・同じオフィス・同じモニター」で揃える。人物の固定属性は毎回書く。
- 保存名は `p01.png`〜`p05.png`。`production/audit_future_v3/references/` に置く。

## 共通ブロック（先頭）
```
Photorealistic cinematic still, widescreen, first frame of a near-future (around 2032) corporate documentary about auditing.
Setting: a minimalist high-floor office with floor-to-ceiling glass, calm cool daylight, long clean desks without paper.
Monitor: one large FLAT ultra-wide desktop monitor (16:9, thin dark bezel, matte), its screen completely dark and blank (very dark navy, no interface, no graphs, no text, only a faint soft reflection of the window). All four corners of the screen clearly visible and unobstructed.
Main character: Japanese male auditor around 40, short neat black hair, thin dark rectangular glasses, slim charcoal crew-neck knit over a white shirt collar, no tie, calm focused expression, mouth closed.
Camera: realistic lens, tripod-like stable framing, the monitor occupies a large part of the frame.
Never include: readable words, numbers, logos, subtitles, captions, watermarks, extra people unless specified, floating holograms.
```

## 共通ブロック（末尾）
```
Single photographic scene, not a collage. Real skin and fabric texture. Clean, premium, quiet.
```

---

## p01.png 朝：モニター前に着く（背面やや斜め）
```
View from behind and slightly to the left of the auditor, seated at the clean desk, facing the large flat monitor. The monitor is centered-right and fills about half of the frame, its blank dark screen facing the camera almost squarely (about 15 degrees of angle). His right hand rests near a slim mouse. Morning light through the glass wall, city skyline soft and defocused behind the monitor.
```

## p02.png 操作：横顔とキーボード（画面は右半分）
```
Side three-quarter view from the auditor's left: his face in profile on the left third of the frame, hands on a slim keyboard, the large flat monitor on the right half of the frame seen at about 30 degrees, screen blank and dark with all corners visible. Cool daylight, calm.
```

## p03.png 共有：会議スペースの壁面モニター（3人、背面）
```
Open meeting area of the same office. A large FLAT wall-mounted display (16:9, thin bezel) fills the center of the frame, screen blank and dark, all four corners visible. Seen from behind: the auditor on the left holding a thin tablet, a Japanese woman around 40 with shoulder-length black hair in a charcoal jacket in the middle, and an older Japanese man around 55 with grey-streaked hair in a navy suit on the right, all standing and facing the display, backs and partial profiles only. Daylight, city skyline through the glass at the sides.
```

## p04.png 承認：パートナーの手元のタブレットと壁面モニター
```
Medium shot in the same meeting area: the older Japanese man in the navy suit holds a thin tablet at chest height with its screen also blank and dark, about to tap it; behind him the large flat wall display, blank and dark, all corners visible. The auditor and the woman stand slightly behind, watching the wall display, mouths closed. Late afternoon warm light, long shadows.
```

## p05.png 翌朝：無人のデスクとモニター
```
The same desk as p01 the next morning, no people in frame: the chair empty, the large flat monitor centered and almost square to the camera, screen blank and dark with all corners visible, fresh cool morning light, a cup of coffee at the side of the desk. Calm and quiet.
```
