# audit_future_v4 人物ショット 開始フレーム用プロンプト（OpenAI画像モデル向け）

## 前提（v3からの変更点を含む）
- 画面はあとから合成する。**すべての画面（机上ディスプレイ、タブレット、壁面）は暗い無地（濃紺〜黒、弱い反射のみ）**。UI・グラフ・文字は描かせない。
- 机上のディスプレイは**大判のフラット画面を約20度寝かせた製図台型**（湾曲なし、細い暗色ベゼル、細いアーム）。**キーボードとマウスは置かない**。
- **タブレットは机に平置き**（画面を上に、ベゼル細く、暗い無地）。合成するので四隅が見えること。
- 壁面は**縁のない表示面**（ベゼルなし、壁の目地で四隅が分かる）か、極細ベゼル。どちらも平面で四隅が見える。
- 人物の**口元は見えない構図**を基本にする（背面、肩越し、口元が画面外）。正面に近い顔を出すのは「聞いている」瞬間のみで、口は閉じる。
- 合成する画面は**画面全体の35%以上**を占める大きさ。角度は正面〜30度。
- サイズは 1536×1024。16:9へ中央クロップするので上下6%ずつ切れる前提で、画面の端を上下の縁に寄せすぎない。
- p01を先に作り、以降は参照画像に添えて「同じ人物・同じオフィス・同じディスプレイ」で揃える。人物の固定属性は毎回書く。
- 保存名は `p01.png`〜`p08.png`。`production/audit_future_v4/references/` に置く。

## 登場人物（固定属性）
- 監査人：Japanese male auditor around 40, short neat black hair, thin dark rectangular glasses, slim charcoal crew-neck knit over a white shirt collar, no tie.
- 同僚：Japanese woman around 40, shoulder-length black hair, charcoal jacket.
- パートナー：older Japanese man around 55, grey-streaked hair, navy suit, light blue shirt, no tie.
- 役員（p07のみ）：Japanese CEO man around 60 in a dark suit; Japanese CFO woman around 50 in a navy dress with a jacket; Japanese audit & supervisory board member man around 60 in a grey suit.

## 共通ブロック（先頭）
```
Photorealistic cinematic still, widescreen, first frame of a near-future (around 2030) corporate documentary about auditing.
Setting: a minimalist high-floor office with floor-to-ceiling glass, long clean desks, no paper, no keyboard, no mouse, no cables, no phones.
Desk display: one large FLAT touch display (16:9, thin dark matte bezel) tilted back about 20 degrees like a drafting table on a slim arm; its screen completely dark and blank (very dark navy, no interface, no graphs, no text, only a faint soft reflection). All four corners of the screen clearly visible and unobstructed.
Tablet: a thin tablet lying flat on the desk, screen up, also completely dark and blank, all four corners visible.
Main character: Japanese male auditor around 40, short neat black hair, thin dark rectangular glasses, slim charcoal crew-neck knit over a white shirt collar, no tie, calm focused posture.
Camera: realistic lens, stable tripod framing, slightly wide (about 28mm), shallow depth of field on the person, the display sharp.
Never include: readable words, numbers, logos, subtitles, captions, watermarks, holograms, floating UI, extra people unless specified, visible mouth unless specified.
```

## 共通ブロック（末尾）
```
Single photographic scene, not a collage. Real skin and fabric texture. Clean, premium, quiet. Colour palette: cool daylight with a warm amber accent from the window.
```

---

## p01.png 朝：製図台型ディスプレイの前に着き、手を伸ばす（背面やや斜め）
```
View from behind and slightly to the left of the auditor, seated at the clean desk, facing the large tilted flat touch display that fills about half of the frame on the centre-right, seen almost squarely (about 15 degrees). His right hand is raised toward the dark screen, index finger extended, fingertip a few centimetres from the glass, not yet touching. The thin tablet lies flat on the desk to the right of his hand, dark and blank. Early morning low amber light through the glass wall, city skyline soft and defocused beyond the display. Only the back of his head and a partial profile visible.
```

## p02.png 対話：肩越し、画面に話しかける（口元は見えない）
```
Over-the-shoulder view from behind the auditor's right shoulder, close enough that the back of his head and shoulder occupy the left third of the frame, out of focus; the large tilted flat touch display is sharp and fills the right two thirds, screen dark and blank with all four corners visible. His left hand rests lightly on the edge of the display, right hand open in a small gesture as if speaking quietly toward the screen. Face not visible. The tablet lies flat on the desk at the lower edge of the frame. Cool mid-morning daylight.
```

## p03.png 資料の連携：平置きタブレットを上へスワイプ（背面右寄り、口元は画面外）
```
View from behind and to the right of the seated auditor, camera slightly above desk height. In the lower foreground the thin tablet lies flat on the desk, screen dark and blank, all four corners visible, large enough to read later; his right index finger rests on the tablet's lower half as if about to swipe upward. Beyond it the large tilted flat touch display stands dark and blank, all corners visible, occupying the upper centre of the frame. His head is at the upper left edge, seen from behind, face not visible. Neutral daylight, calm.
```

## p04.png チーム共有：縁のない壁面表示の前に3人（背面）
```
Open meeting area of the same office. A large FLAT wall display with no bezel (the display surface flush with the wall, its edges marked only by thin seams) fills the centre of the frame, completely dark and blank, all four corners visible. Seen from behind: the auditor on the left holding a thin tablet horizontally at waist height tilted slightly toward the wall, the Japanese woman around 40 with shoulder-length black hair in a charcoal jacket in the middle, and the older Japanese man around 55 with grey-streaked hair in a navy suit on the right, all standing facing the display, backs and partial profiles only, no mouths visible. Daylight, city through the glass at the sides.
```

## p05.png 承認：パートナーが壁面にタッチする（背面〜横）
```
Same meeting area, late afternoon warm light with long shadows. The older Japanese man around 55 with grey-streaked hair in a navy suit stands close to the large bezel-less flat wall display, seen from behind and slightly to the left, his right hand raised toward the dark blank screen, index finger a few centimetres from the surface, not yet touching. The display fills about 60 percent of the frame, all four corners visible, his body covering only part of the lower left area. In the background at the right edge, the auditor in a charcoal knit and the woman in a charcoal jacket stand watching, seen from behind. No faces visible.
```

## p06.png 翌朝：無人のデスク
```
The same desk as p01 the next morning, no people in frame: the chair empty, the large tilted flat touch display centred and almost square to the camera, screen dark and blank, all four corners visible; the thin tablet flat on the desk to the right, dark; a white coffee cup; fresh cool morning light with a thin band of sunlight crossing the desk surface. Calm and quiet.
```

## p07.png クライアント報告：役員会議室、パートナーが壁面を示す
```
A different space: the executive boardroom of a client company, daytime, calm. A long dark walnut table, leather chairs, warm neutral light, city view through tall windows at the right. At the end of the room a large FLAT wall display with a very thin bezel, completely dark and blank, all four corners visible, filling about 45 percent of the frame on the centre-left. The older Japanese man around 55 with grey-streaked hair in a navy suit stands beside the display at its right edge, seen from behind at three-quarter angle, his left hand extended toward the dark screen, face not visible. Seated at the near side of the table with their backs or partial profiles to the camera: a Japanese man around 60 in a dark suit, a Japanese woman around 50 in a navy dress and jacket, and a Japanese man around 60 in a grey suit, all looking toward the display. Two thin tablets lie flat on the table, dark. No paper documents.
```

## p08.png インサート：役員のタブレットが同期し、指でなぞる
```
Close shot across the boardroom table: a thin tablet lying flat on the dark walnut table, screen dark and blank, all four corners visible, filling about half of the frame; the hand of the Japanese woman around 50 (navy jacket sleeve, simple watch) rests beside it with the index finger about to touch the lower part of the screen. Beyond the tablet, out of focus, the edge of the wall display and the partner's navy suit. Warm neutral boardroom light. No faces.
```

## 生成後の確認ポイント
- 四隅：机上ディスプレイ・タブレット・壁面それぞれの四隅が人物や手で隠れていないか。
- 口元：見えていないか。見えている場合は構図を変えるか、作り直す。
- 画面の無地：反射やグラデーションが強すぎると合成のキーが外れる。暗く平坦に。
- 製図台型の角度：寝かせすぎると画面が細く潰れて合成後の文字が読みにくい。15〜25度。
