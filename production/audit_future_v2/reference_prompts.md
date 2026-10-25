# audit_future_v2 開始フレーム用プロンプト（OpenAI画像モデル向け）

## 使い方
- サイズは **1536×1024**（横長）。16:9へ中央クロップするので、上下それぞれ約6%は切れる前提で、重要なものを上下端に置かない。
- 各画像は、そのシーンの **「開始状態」**（まだ起きていない状態）を描く。動画側で「ノードが点灯する」「パネルが開く」などの変化を付けるため。
- **先にシーン1を作り、以後はシーン1の画像を参照画像（image edit / reference）に添えて**「同じ人物・同じオフィス・同じUI様式で」と指示する。人物の固定属性は毎回プロンプトに書く。
- 画面内の文字は読めないものにする（AI動画側で崩れるため）。数字も入れない。
- 保存名は `scene01.png` 〜 `scene08.png`。できたら `production/audit_future_v2/references/` に置いてください。

## 共通ブロック（全プロンプトの先頭に付ける）

```
Photorealistic cinematic still, widescreen, first frame of a near-future (around 2032) corporate documentary about auditing.
Setting: a minimalist high-floor office with floor-to-ceiling glass, calm cool daylight, long clean desks without paper, soft indirect lighting.
Technology: large transparent glass display panels (edge-lit, slightly tinted), with a thin layer of spatial UI that appears to float a few centimeters in front of the glass. UI style: dark navy translucent cards, fine teal lines, amber used only for the one item that needs attention, no red alarms, no neon clutter, no sci-fi hologram kitsch.
Main character: Japanese male auditor around 40, short neat black hair, thin dark rectangular glasses, slim charcoal crew-neck knit over a white shirt collar, no tie, calm focused expression, mouth closed.
Camera: realistic lens, shallow depth of field, restrained composition with breathing space for a later slow camera move.
Never include: readable words, numbers, logos, subtitles, captions, watermarks, extra people unless specified, robots, floating brains.
```

## 共通ブロック（末尾に付ける）

```
Single photographic scene, not a collage or storyboard. Real skin and fabric texture. Clean, premium, quiet.
```

---

## scene01.png 俯瞰（グループのリスクマップ）
```
View from behind and slightly to the side of the auditor, seated at a clean desk before a wide transparent glass display. On the glass, a three-dimensional network map of a corporate group: about twenty small glowing nodes connected by fine lines, arranged like a constellation in depth, most nodes pale teal, one node near the center a soft amber. Beside the map, a few translucent navy cards with abstract bars. His right hand rests lightly on the desk, about to reach toward the amber node. Morning light through the glass wall, city skyline faint and defocused behind the display.
```

## scene02.png 根拠（ノードを開く、知識の層へ）
```
Closer shot over the auditor's shoulder, the amber node now at the center of the transparent display, enlarged into a translucent card cluster: several thin abstract bars of different lengths (contribution indicators) and small tag-like chips beneath. From the cluster, a few fine threads of light lead backward into the depth of the display, where a dim layered field of countless small translucent record tiles recedes into dark teal space, suggesting accumulated knowledge behind the score. His index finger is just touching the glass at the card.
```

## scene03.png 対話（文字で問いかける）
```
Side three-quarter view of the auditor at the desk. The transparent display now shows, on its right half, a vertical conversation panel: a few empty rounded message bubbles, the last one with a blinking text cursor; on the left half, the network map has shrunk to a small inset. His hands are on a slim glass keyboard, starting to type. His face in profile is visible, mouth closed, eyes on the panel. Cool daylight, calm.
```

## scene04.png 証拠（該当箇所が浮かび上がる）
```
Frontal view through the transparent display toward the auditor's face, slightly defocused behind the glass; the UI is sharp in the foreground. Three document panels are arranged in space in front of him: a contract-like page with dense abstract paragraph lines, a formal minutes-like page with a header block, and a ledger-like table of thin rows. Each page is still untouched, no highlights yet; a small teal assistant ring glows at the bottom edge, as if about to act. Faint reflections of the city in the glass.
```

## scene05.png 判断と調書（人が決め、AIが紐づける）
```
Top-down three-quarter view of the desk and the lower part of the transparent display. On the display, a working-paper layout: a single short handwritten-style stroke line at the top (the auditor's own note, abstract, unreadable), and below it an empty structured area with faint placeholder frames and small link markers waiting to be filled. The auditor's hand holds a slim stylus just finishing the stroke on the glass. The three document panels from before are stacked small at the side. Warm late-morning light.
```

## scene06.png 共有（壁一面へ広げる）
```
Wide shot of an open meeting area in the same office: a floor-to-ceiling glass wall that is also a display, currently almost clear with only a faint grid of light. The auditor stands at the left holding a thin tablet, mid-gesture, sweeping his hand from the tablet toward the wall, as if sending the screen there. Two colleagues approach from the right: a Japanese woman around 40 with shoulder-length black hair in a charcoal jacket, and an older Japanese man around 55 with grey-streaked hair in a navy suit, both walking, faces calm, mouths closed. Daylight, city skyline behind the glass.
```

## scene07.png 議論（論点ボードとAIの参加）
```
The same glass wall seen from behind the three people, now filled with a collaborative board: a horizontal timeline with three glowing markers across the top, several pastel sticky-note cards floating at different depths, an empty column on the right with three round bullet marks waiting for text, and in the lower corner a small teal assistant ring with a short line beneath it like a note being written. The woman is reaching to move one card; the auditor holds the tablet; the older man stands with arms loosely folded. Backs and partial profiles only, no mouths visible.
```

## scene08.png 継続（承認、そして翌朝へ）
```
Medium shot of the older man in the navy suit holding a tablet at chest height, tapping a single large teal confirmation element on it; the auditor and the woman stand slightly behind, watching the glass wall where the group network map is displayed again, the amber node still amber. Light is turning to late afternoon, long warm shadows, city lights just beginning to appear. Calm, no smiles toward camera, mouths closed.
```

## 任意（あると動画の到達点を指定できる）

### scene02_end.png 知識の層の内部
```
Inside the dark teal knowledge space seen through the display: two tall walls of translucent record tiles receding into depth, a few tiles brightened and drifting toward a small glowing sphere at the center, connected by fine threads of light. No people, no readable text.
```

### scene08_end.png 翌朝の更新されたマップ
```
Same glass wall as scene08 but the next morning, fresh cool light, no people in frame: the network map with the former amber node now pale teal, and a different node on the edge softly amber, with two tiny badge dots on nearby cards.
```
