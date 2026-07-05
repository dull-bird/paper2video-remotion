# Slide schema + worked examples + text budgets

Types live in `src/content/types.ts` — import them, don't redefine:

```ts
export type SlideKind =
  | "title"
  | "bullets"
  | "table"
  | "quote"
  | "compare"
  | "formula"
  | "image"
  | "end";

export interface BaseSlide {
  id: string;        // "NN-slug", e.g. "03-mainstream-vs-truth"
  kind: SlideKind;
  narration: string;  // full spoken paragraph, ≤300 Chinese chars, 100-200 is the sweet spot
}

export interface TitleSlide extends BaseSlide {
  kind: "title";
  eyebrow: string;
  title: string;
  subtitle: string;
  photo?: string;     // path relative to public/, e.g. "images/<deck>/author.jpg"
  intro?: string[];   // 2–4 credential/stance bullets shown under the subtitle
}
export interface BulletsSlide extends BaseSlide { kind: "bullets"; heading: string; tag?: string; bullets: string[]; }
export interface QuoteSlide extends BaseSlide { kind: "quote"; heading: string; quote: string; quoteEn?: string; attribution: string; }
export interface TableSlide extends BaseSlide { kind: "table"; heading: string; columns: string[]; rows: string[][]; footnote?: string; }
export interface CompareSlide extends BaseSlide { kind: "compare"; heading: string; left: { label: string; items: string[] }; right: { label: string; items: string[] }; }
export interface FormulaSlide extends BaseSlide { kind: "formula"; heading: string; formulas: Array<{ latex: string; caption?: string }>; footnote?: string; }
export interface ImageSlide extends BaseSlide { kind: "image"; heading: string; src: string; caption?: string; objectFit?: "contain" | "cover"; }
export interface EndSlide extends BaseSlide { kind: "end"; heading: string; lines: string[]; }
```

## When to use which kind

- `title` — slide 1 only. Supports an optional `photo` + `intro` for a richer cover (author headshot + credentials + latest stance).
- `bullets` — default workhorse for explaining a step, a section, a list of points. Use `tag` for a small English label in the header (e.g. "Step 1", "Background") — optional, omit if the slide doesn't map to a named stage.
- `quote` — one single striking direct quotation worth dwelling on. Not for a list of points — that's `bullets`.
- `table` — structured comparison with real numeric/categorical data across ≥2 columns. Not for qualitative pros/cons — that's `compare`.
- `compare` — two competing viewpoints, options, or approaches side by side, each as a short bullet list. Not for numeric data — that's `table`.
- `formula` — one or more LaTeX equations that need to be rendered crisply (e.g. `C \approx 6ND`, `N_{\text{opt}} \propto C^{0.5}`). Keep `heading` short; each formula should fit on one or two lines.
- `image` — a figure, chart, or diagram from the source material. Place the image in `public/images/<deck>/` and reference it with a relative path from `public/` (e.g. `src: "images/<deck>/figure-1.png"`). Use `objectFit: "contain"` for diagrams; `"cover"` for full-bleed background-style images.
- `end` — last slide only, references/citations/links.

## Text-length budgets (soft guide, verify with `remotion still` if pushing these)

These are the lengths that are known to render cleanly at 1920×1080 with this project's fonts/padding (validated against the shipped `scaling-laws.ts` deck):

| Kind | Field | Budget |
|---|---|---|
| title | `title` | ≤ 14 Chinese chars (wraps to 2 lines past that) |
| title | `subtitle` | ≤ 30 chars |
| title | `intro[]` each line | ≤ 45 chars; 2–4 lines recommended |
| title | `photo` | headshot or clear portrait, placed in `public/images/<deck>/` |
| bullets | `heading` | ≤ 12 chars |
| bullets | each `bullets[]` item | ≤ 45 chars (one line); ≤ 5 bullets total |
| quote | `quote` | ≤ 35 chars |
| quote | `attribution` | ≤ 35 chars |
| table | `heading` | ≤ 14 chars |
| table | each cell | ≤ 12 chars; ≤ 4 columns, ≤ 4 rows |
| compare | `heading` | ≤ 12 chars |
| compare | each `items[]` entry (either side) | ≤ 25 chars; ≤ 3 items per side |
| formula | `heading` | ≤ 12 chars |
| formula | each `latex` | ≤ 80 chars rendered width; ≤ 2 formulas per slide |
| formula | each `caption` | ≤ 40 chars |
| image | `heading` | ≤ 12 chars |
| image | `caption` | ≤ 50 chars |
| end | each `lines[]` entry | ≤ 40 chars; ≤ 6 lines |

Going over these isn't automatically broken — CSS flexbox wraps rather than clips — but more than ~2 lines of wrap in a `bullets` item, or more than 5 bullets, risks pushing content past the 1080px frame vertically. Render a still and look (see SKILL.md step 7) rather than guessing.

## Worked example (one per kind, from `scaling-laws.ts`)

```ts
{
  id: "01-title", kind: "title",
  eyebrow: "Complete Skeptic · Diogo Almeida",
  title: "Scaling Laws, Honestly",
  subtitle: "原始 Scaling Law 的一个 bug，如何让全行业多烧了两年算力",
  narration: "大家好。今天要讲的这篇文章标题是《Scaling Laws, Honestly》...",
}

// Cover with author photo + credentials + latest stance (recommended for Bilibili)
{
  id: "01-title", kind: "title",
  eyebrow: "Lil'Log · Lilian Weng",
  title: "Scaling Laws, Carefully",
  subtitle: "一条定律如何统治大模型时代，又因何被悄悄改写",
  photo: "images/<deck>/lilian-weng.jpg",
  intro: [
    "前 OpenAI 研究副总裁 · 北大本科 · 印第安纳大学博士",
    "热门技术博客 Lil'Log 作者",
    "最新观点：Scaling Law 不是铁律，数据墙正在改写它",
  ],
  narration: "大家好。今天我们要聊的是 Lilian Weng 翁荔的最新思考。...",
}

{
  id: "05-step1", kind: "bullets", tag: "Step 1",
  heading: "Bug 三步曲 · 第一步",
  bullets: [
    "对所有模型使用固定的训练 token 数：约 130B tokens",
    "小模型：相对自身容量被「喂饱」甚至「喂撑」",
    "大模型：同样 130B tokens 下严重「营养不良」",
    "光这一条，就足以得出错误的 Scaling Law",
  ],
  narration: "第一步：对所有模型使用固定的训练数据量...",
}

{
  id: "07-step3", kind: "quote",
  heading: "Bug 三步曲 · 第三步",
  quote: "结果「基本不受学习率调度影响」",
  quoteEn: "largely independent of learning rate schedule",
  attribution: "在固定 token 上限下技术上正确，但不适用于「无限数据极限」的理想世界",
  narration: "第三步，也是最容易被忽略的一步...",
}

{
  id: "08-result-table", kind: "table",
  heading: "后果：模型被训得又大又欠练",
  columns: ["对比项", "GPT-3（原版 Kaplan）", "Chinchilla（DeepMind）"],
  rows: [
    ["参数量 N", "175B（虚胖）", "70B（不到 GPT-3 一半）"],
    ["训练数据 D", "~300B tokens", "1.4T tokens（4 倍多）"],
    ["同算力表现", "被反超", "全面胜出"],
  ],
  footnote: "同一笔算力，一个被养成「虚胖壮汉」，一个被练成「精瘦拳手」",
  narration: "看后果就很直观了...",
}

{
  id: "03-mainstream-vs-truth", kind: "compare",
  heading: "主流解释 vs 真正原因",
  left: { label: "学界主流解释", items: ["Kaplan 与 Chinchilla 结论不同", "原因：两者统计参数总数 N 的方式不一样"] },
  right: { label: "Diogo 的说法", items: ["口径差异不是真正原因", "真正原因：原始论文里藏着一个 bug"] },
  narration: "学界主流解释认为...",
}

{
  id: "06-kaplan-conclusion", kind: "formula",
  heading: "Kaplan 的结论",
  formulas: [
    { latex: "N_{\\text{opt}} \\propto C^{0.73}", caption: "模型应比数据增长更快" },
    { latex: "D_{\\text{opt}} \\propto C^{0.27}", caption: "数据增长相对较慢" },
  ],
  footnote: "换言之：做大模型，然后提前停止训练",
  narration: "Kaplan 论文最被广泛引用的结论是这个...",
}

{
  id: "05-kaplan-image", kind: "image",
  heading: "Kaplan et al. 2020",
  src: "images/scaling-laws-carefully/kaplan-1.png",
  caption: "OpenAI 论文中的三条幂律曲线：算力、数据、参数",
  objectFit: "contain",
  narration: "这是 Kaplan 等人二零二零年论文里的核心图...",
}

{
  id: "10-end", kind: "end",
  heading: "参考资料",
  lines: [
    "一手原文：Scaling Laws, Honestly — Diogo Almeida (Complete Skeptic)",
    "引发讨论：Scaling Laws, Carefully — Lilian Weng (Lil'Log)",
  ],
  narration: "以上就是这篇文章的核心内容...",
}
```
