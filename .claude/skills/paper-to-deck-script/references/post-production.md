# Post-production guide

This reference covers everything after the slide script is written: voiceover, render, subtitles, and cover-page polish.

---

## 1. Voiceover with Alibaba Cloud ISI (Stanley)

The project uses `scripts/generate-voiceover.mjs`. It prefers **阿里云智能语音交互（ISI）** with the `stanley` voice.

### Required credentials

Set three environment variables:

```bash
export ALIBABA_CLOUD_ACCESS_KEY_ID=<你的 AccessKey ID>
export ALIBABA_CLOUD_ACCESS_KEY_SECRET=<你的 AccessKey Secret>
export NLS_APPKEY=<你的 NLS Appkey>
```

- `ALIBABA_CLOUD_ACCESS_KEY_ID` / `ALIBABA_CLOUD_ACCESS_KEY_SECRET` — from Alibaba Cloud RAM console.
- `NLS_APPKEY` — create a project in the [Alibaba Cloud ISI / 智能语音交互控制台](https://nls-portal.console.aliyun.com/) and copy its Appkey.

> Note: ISI and DashScope/百炼 are different products. This script signs RPC requests directly for ISI; it does **not** use `DASHSCOPE_API_KEY`.

### Fallback without credentials

If any of the three variables is missing, the script falls back to macOS local `say -v Tingting`. This is useful for testing the pipeline, but the final video should use Stanley.

### Generate audio

```bash
npm run voiceover -- --deck=<slug>
# writes public/voiceover/<slug>/<NN-slug>.mp3 for every slide
```

Per-slide narration length must be ≤ 300 Chinese characters because the ISI short-text TTS endpoint has that limit. The sweet spot is 100–200 characters.

---

## 2. Render the MP4

```bash
npx remotion render <CompositionId> out/<slug>.mp4 --concurrency=1 --gl=swiftshader --timeout=600000
```

Recommended flags for stability, especially on image/formula-heavy decks:

| Flag | Why use it |
|---|---|
| `--concurrency=1` | Prevents memory-related browser crashes when large images are loaded. |
| `--gl=swiftshader` | Software rendering; most reliable on macOS. |
| `--timeout=600000` | Per-frame timeout in ms (10 minutes). Raise if frames are complex. |

If the render still times out, increase the **shell task timeout** (not the Remotion timeout) and retry. Long decks (~7+ minutes) can take 13–17 minutes total.

---

## 3. Subtitles for Bilibili

After voiceover is ready, run:

```bash
python3 scripts/generate-subtitles.py
# writes out/<slug>.srt
```

How it works:
1. Reads `src/content/<slug>.ts` to get slide order and narrations.
2. Uses `ffprobe` to get the real duration of each `public/voiceover/<slug>/<id>.mp3`.
3. Splits narrations by sentence-ending punctuation（。；！？）.
4. Distributes each slide's audio duration across its sentence chunks proportionally by character count.
5. Writes a standard UTF-8 SRT file.

Upload `out/<slug>.mp4` + `out/<slug>.srt` to Bilibili.

---

## 4. Cover-page best practices for Bilibili

A strong cover answers three things in the first few seconds: **who is speaking, what is the topic, and why it matters now**.

Use the optional `photo` and `intro` fields on the `title` slide:

```ts
{
  id: "01-title",
  kind: "title",
  eyebrow: "Lil'Log · Lilian Weng",
  title: "Scaling Laws, Carefully",
  subtitle: "一条定律如何统治大模型时代，又因何被悄悄改写",
  photo: "images/<slug>/lilian-weng.jpg",
  intro: [
    "前 OpenAI 研究副总裁 · 北大本科 · 印第安纳大学博士",
    "热门技术博客 Lil'Log 作者",
    "最新观点：Scaling Law 不是铁律，数据墙正在改写它",
  ],
  narration: "大家好。今天我们要聊的是 Lilian Weng 翁荔的最新思考。...",
}
```

### Photo sourcing tips

- Prefer a clear headshot or portrait with the subject's face visible.
- Place the image in `public/images/<slug>/` and reference it relative to `public/`.
- Avoid watermarks if possible; if unavoidable, a circular crop or `object-fit: cover` will often hide corner watermarks.
- If no usable photo exists, omit `photo` and fall back to a text-only cover.

### Opening narration

Start with the author's **latest view or central claim**, then introduce the source and background. Do not begin with generic filler.

Good:
> "大家好。今天我们要聊的是 Lilian Weng 翁荔的最新思考。在她离开 OpenAI 后写的这篇《Scaling Laws, Carefully》里，她提出一个核心判断：Scaling Law 并不是一条铁的定律……"

Avoid:
> "今天我们来学习一篇论文。这篇论文很重要。作者叫 Lilian Weng……"

---

## 5. Final checklist before publishing

- [ ] `npm run lint` passes (eslint + tsc).
- [ ] Cover slide has a photo + intro if a usable photo exists.
- [ ] At least one problematic slide was checked with `npx remotion still ...` and looks clean.
- [ ] Voiceover was generated with Stanley (not Tingting fallback).
- [ ] Final MP4 plays end-to-end.
- [ ] `out/<slug>.srt` timing matches the final MP4.
