---
name: paper-to-deck-script
description: Turn a paper, arXiv link, or long-form Chinese/English article into a new Chinese-narrated deck for this repo's Remotion video pipeline — write a new src/content slide script, register it in Root.tsx, generate voiceover, render MP4, and produce Bilibili-ready subtitles. Use when the user gives a paper/article/URL and asks to turn it into a video/讲解视频/PPT视频 in this project, or says "加一个新脚本"/"再做一期".
---

# Paper to deck script

Turns source material into `src/content/<slug>.ts` (a `Slide[]` array) that plugs directly into this repo's existing render pipeline, then drives the rest of the pipeline (voiceover, render, subtitles).

This skill covers **content authoring + post-production**. It should not touch rendering code (`src/scenes/*`, `src/DeckComposition.tsx`) unless a genuinely new slide layout is needed.

---

## Part 1 — Content methodology

Before writing any slide, do these seven steps in order.

### 1. Read the source for structure, not sentence-by-sentence

Extract the skeleton first:
- What question is the author trying to answer?
- What are the main sections / layers?
- What evidence, cases, formulas, figures, or quotes support each section?
- What is the final conclusion?

Do not translate paragraph-by-paragraph. A deck is a re-structuring, not a re-wording.

### 2. Find the story arc

Map the source onto a narrative arc so the video has rhythm:

```
背景 (Background) → 核心发现 (Core finding) → 争议/反驳 (Conflict / rebuttal) → 现实意义 (Implication) → 结论 (Conclusion)
```

Not every source has all five stages — drop the ones that don't apply (see [references/skeletons.md](references/skeletons.md)). Never pad the deck to hit a slide count.

### 3. Distinguish fact, opinion, and inference

| Type | How to handle it on a slide |
|---|---|
| **Fact** | Directly quote numbers, formulas, figures, tables from the source. |
| **Opinion** | Attribute it: "作者认为...", "论文指出...", "X 团队提出...". Don't let a cited claim sound like the primary source's own finding. |
| **Inference** | Use the source's own wording if possible. If the source doesn't explicitly say it, weaken to "暗示" / "意味着" / "可以解读为", or cut it. |

### 4. Anti-hallucination check

Every sentence in `narration` and every bullet/cell/formula on a slide must trace back to the source. If you cannot point to where the source says it, remove it. See [references/grounding-rules.md](references/grounding-rules.md) for the full checklist.

### 5. Map content to slide kinds

Use the eight kinds in `src/content/types.ts`:

- `title` — slide 1 only.
- `bullets` — default workhorse for a step, section, or list.
- `quote` — one striking direct quotation worth dwelling on.
- `table` — structured numeric/categorical comparison with real data.
- `compare` — two viewpoints or approaches side by side.
- `formula` — LaTeX equations that need crisp rendering.
- `image` — figures, charts, diagrams from the source.
- `end` — last slide only, references/citations/links.

One slide = one point. See [references/schema.md](references/schema.md) for per-kind text budgets and worked examples.

### 6. Control narration length

- Hard limit: **≤ 300 Chinese characters** per slide (limit of the ISI short-text TTS endpoint).
- Sweet spot: **100–200 characters** (≈ 20–40s at natural pace).
- Formula / image slides can be shorter.
- `narration` is the spoken paragraph; on-screen text (`bullets`, `heading`, etc.) is the condensed visual version. They should not be identical copy-paste.

### 7. Align media assets to the narration

For every `image` or `formula` slide, the visual must illustrate the exact point being spoken that moment. Avoid putting a figure on screen while the narration is still introducing background from two slides ago.

---

## Part 2 — Writing the deck

### File conventions

- Path: `src/content/<slug>.ts` (kebab-case, matches `DECK_ID`).
- Slide `id`: `NN-slug` (e.g. `03-mainstream-vs-truth`), zero-padded, matches array order.
- Export:
  ```ts
  export const slides: Slide[] = [...];
  export const DECK_ID = "<slug>";
  export const DECK_TITLE = "Readable Deck Title"; // ≤ 30 chars, shown in top-left chrome
  ```
- Import types with `import type { Slide } from "./types";` — do not redefine interfaces per-deck.
- `TitleSlide` supports optional `photo` and `intro` fields for a richer cover. See [references/schema.md](references/schema.md).

### Register in `src/Root.tsx`

Import `slides` / `DECK_ID` / `DECK_TITLE` from the new file, call `createDeck(DECK_ID, slides, DECK_TITLE)`, and add a `<Composition>` with a PascalCase `id`. Copy the existing `scalingLaws` block pattern.

---

## Part 3 — Sanity check before audio

This project renders slide layouts with real CSS flexbox, so the main risk is vertical overflow (too many bullets / too-long lines pushing content past 1080px).

If any slide pushes the budgets in [references/schema.md](references/schema.md), render a still and look:

```bash
npx remotion still <CompositionId> --frame=<mid-frame-of-slide> --gl=swiftshader /tmp/check.png
```

Then read the PNG back. Fix overflow by shortening text, splitting into two slides, or shrinking font sizes in the scene — do not guess.

---

## Part 4 — Voiceover + render

Generate audio:

```bash
npm run voiceover -- --deck=<slug>
# writes public/voiceover/<slug>/*.mp3
```

`generate-voiceover.mjs` auto-detects Aliyun ISI credentials and falls back to local macOS `say` (Tingting) if absent. See [references/post-production.md](references/post-production.md) for credential setup, render flags, subtitle generation, and cover-page tips.

Render the MP4:

```bash
npx remotion render <CompositionId> out/<slug>.mp4 --concurrency=1 --gl=swiftshader --timeout=600000
```

Use these flags for stability on long decks:
- `--concurrency=1` — avoids memory-related browser crashes on image-heavy decks.
- `--gl=swiftshader` — software rendering, most reliable on macOS.
- `--timeout=600000` — per-frame timeout in ms; raise if frames are complex.

If a render still fails, increase the shell timeout (not the Remotion timeout) and retry; the previous failure is usually a duration issue, not a code issue.

---

## Part 5 — Post-production

### Cover page best practices

A strong Bilibili cover slide should immediately answer "谁在讲、讲什么、为什么现在看」：

- `photo` — a clear headshot of the author or key figure (place in `public/images/<slug>/`).
- `intro` — 2–4 bullet lines of credentials + the author's latest/most relevant stance.
- `narration` — open with the latest view or central claim, then introduce the source and the speaker's background.

Example:
```ts
{
  id: "01-title",
  kind: "title",
  eyebrow: "Lil'Log · Lilian Weng",
  title: "Scaling Laws, Carefully",
  subtitle: "一条定律如何统治大模型时代，又因何被悄悄改写",
  photo: "images/<slug>/author.jpg",
  intro: [
    "前 OpenAI 研究副总裁 · 北大本科 · 印第安纳大学博士",
    "热门技术博客 Lil'Log 作者",
    "最新观点：Scaling Law 不是铁律，数据墙正在改写它",
  ],
  narration: "大家好。今天我们要聊的是 Lilian Weng 翁荔的最新思考。...",
}
```

### Subtitles for Bilibili

Run the subtitle generator after voiceover is ready:

```bash
python3 scripts/generate-subtitles.py --deck=<slug>
# writes out/<slug>.srt
```

It reads `src/content/<slug>.ts`, probes each `public/voiceover/<slug>/<id>.mp3` for duration, splits narrations by sentence-ending punctuation, and outputs a Bilibili-compatible SRT file.

Upload `out/<slug>.mp4` + `out/<slug>.srt` to Bilibili together.

---

## When a new slide layout is genuinely needed

Only if none of the eight `kind`s fit (e.g. a code-diff slide, a timeline, an interactive animation): add `src/scenes/<Name>Scene.tsx` following the pattern of existing scenes (use `revealStyle` from `src/components/reveal.ts`, pull colors from `src/theme.ts`), add the new interface to `src/content/types.ts`, and register the `kind` in `src/scenes/SlideView.tsx`. This is rare — check [references/schema.md](references/schema.md) first.
