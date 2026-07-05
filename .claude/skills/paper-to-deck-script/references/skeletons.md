# Narrative skeletons

Pick one based on source type, then cut sections that don't apply — never pad the deck to hit a slide count. A skeleton is a checklist of *what to consider*, not a mandatory quota of slides.

## Academic paper skeleton (adapted from showlab/PaperTalker's `slide_beamer_prompt.txt`)

Use for arXiv papers / conference papers. Roughly 10–14 slides; `method` section may span multiple slides if it has distinct sub-components.

1. **开场** (`title`) — paper title, authors/institution, one-line hook
2. **背景与问题** (`bullets`) — what problem this solves, why it matters, how it differs from prior work
3. **相关工作** (`bullets` or `compare`) — current landscape, what's missing
4. **方法** (`bullets`, one slide per sub-component if the method has distinct stages) — core technical approach
5. **实验设计** (`bullets`) — how they tested it
6. **实验设置** (`table`) — datasets, hyperparameters, environment, if worth showing
7. **实验结果** (`table` or `bullets`) — main results, comparison to baselines
8. **消融实验** (`table` or `bullets`) — what happens when you remove each component
9. **局限性** (`bullets`) — what the paper itself admits doesn't work
10. **未来方向** (`bullets`) — where this could go
11. **结尾** (`end`) — references, arXiv link, citation

## Article / blog-post skeleton (used for `scaling-laws.ts`)

Use for news, blog posts, opinion pieces, non-peer-reviewed write-ups. Roughly 8–10 slides.

1. **标题引入** (`title`) — hook + one-line thesis; optionally add `photo` + `intro` for author/figure background (see post-production.md)
2. **背景** (`bullets`) — context needed to understand the claim, what triggered this piece
3. **核心分歧** (`compare`) — if the piece is structured around "mainstream view vs. author's claim", use this; skip if there's no real disagreement to contrast
4. **关键证据/线索** (`quote`) — the one quotable line that anchors the whole argument
5–7. **核心论证，分步展开** (`bullets` ×2–3) — one slide per distinct step of the argument; this is usually the bulk of the deck
8. **结果对比** (`table`) — only if the source has comparable before/after numbers; skip otherwise
9. **结论与启示** (`bullets`) — what the author concludes, what it means going forward
10. **结尾** (`end`) — sources, links

## Choosing / compressing

- Short source material (a tweet thread, a short news item) → compress to 5–6 slides: title, 2–3 bullets slides, end. Don't force it through every skeleton stage.
- If there's no real "mainstream vs. contrarian" framing, skip `compare` — don't manufacture a conflict that isn't in the source.
- If there are no comparable numbers, skip `table` — a table with invented or approximated data is worse than no table (see grounding-rules.md).
