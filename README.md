# paper2video-remotion

低成本、可控、可复现的「论文/文章 → 中文讲解视频」流水线，用 [Remotion](https://www.remotion.dev)（React 渲染视频）代替 [showlab/Paper2Video](https://github.com/showlab/Paper2Video) 里那套 GPU + agent 黑盒方案。

**首个示例内容**：Diogo Almeida《[Scaling Laws, Honestly](https://www.completeskeptic.com/p/scaling-laws-honestly)》—— OpenAI 原始 Scaling Law 里的一个 bug，如何让全行业多烧了两年算力。

## 为什么不直接用 Paper2Video

| | showlab/Paper2Video | 本项目 |
|---|---|---|
| 硬件要求 | NVIDIA A6000 48G | 纯 CPU，Mac 可跑 |
| 依赖 | GPT-4.1 / Gemini-2.5-Pro API + Hallo2 | 一个 TTS 接口 |
| 可控性 | agent 自动生成 Beamer，出了问题难改 | React 组件，像素级可控，逐帧可预览 |
| 产物语言 | 英文为主 | 中文优先（概念保留英文原词） |
| 复现成本 | 高（多依赖、多环境） | `npm i && npm run dev` |

代价：没有 talking-head 数字人播讲（Paper2Video 也自带无数字人的 fast 模式，本质是同一取舍）。

## 目录结构

```
src/
  content/scaling-laws.ts   # 中文脚本：10 页幻灯片的标题/要点/旁白文案
  theme.ts                  # 配色、字体（Noto Sans SC）、画布尺寸
  DeckComposition.tsx        # 主 Composition：按音频真实时长动态排布每页
  components/                # 背景、进度条/页眉页脚、揭示动画
  scenes/                    # 6 种幻灯片类型：标题/要点/引用/表格/对比/结尾
scripts/
  generate-voiceover.mjs      # 生成中文旁白音频（阿里云 Stanley，或本地 say 兜底）
```

## 快速开始

```bash
npm i
npm run voiceover   # 生成旁白音频（见下）
npm run dev         # 打开 Remotion Studio 预览
npm run render      # 渲染出 out/scaling-laws-honestly.mp4（1920x1080, ~4.5min）
```

## 配置阿里云 Stanley 音色

`Stanley`（沉稳男声）来自阿里云**智能语音交互 ISI**，和 DashScope/百炼是两个不同产品，鉴权方式也不同——不是 `DASHSCOPE_API_KEY`，而是 AccessKey 签名 + Token：

```bash
export ALIBABA_CLOUD_ACCESS_KEY_ID="你的 AccessKey ID"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="你的 AccessKey Secret"
export NLS_APPKEY="你在 NLS 控制台创建的项目 Appkey"   # https://nls-portal.console.aliyun.com/applist
npm run voiceover
```

没配置这三个变量时，脚本会自动回退到 macOS 本地 `say -v Tingting` 生成占位音频，保证整条流水线随时可跑通、可预览；配好凭证后重新跑一次 `npm run voiceover` 即可无缝换成 Stanley，无需改任何视频代码——`DeckComposition.tsx` 里的 `calculateMetadata` 会自动读取每段音频的真实时长来排布画面。

## 新增一篇论文/文章

1. 写 `src/content/<slug>.ts`，导出 `slides: Slide[]` 和 `DECK_ID`（类型定义在 [`src/content/types.ts`](src/content/types.ts)，六种 `kind`：`title` / `bullets` / `quote` / `table` / `compare` / `end`）
2. 在 [`src/Root.tsx`](src/Root.tsx) 里照着 `scalingLaws` 那几行，调 `createDeck(DECK_ID, slides)` 并加一个 `<Composition>`
3. `npm run voiceover -- --deck=<slug> && npx remotion render <CompositionId> out/<slug>.mp4`

Claude Code 用户可以直接用 [`.claude/skills/paper-to-deck-script`](.claude/skills/paper-to-deck-script/SKILL.md) 这个 skill 走完"读论文 → 写脚本 → 注册 → 出片"全流程——里面固化了从 showlab/PaperTalker 的论文转 PPT prompt 里借鉴的规则（固定叙事骨架、反幻觉取材规则、脚本字数约束），去掉了 LaTeX 编译和 GPU 视觉判断这些我们不需要的部分。

新增版式（六种都不合适时）：在 `src/scenes/` 加一个组件，类型加进 `types.ts`，在 `src/scenes/SlideView.tsx` 里注册 `kind`。

## 成本

- 视频渲染：本地 CPU，免费。
- TTS：阿里云 ISI 按字符计费（试用版/商用版价格见[官方文档](https://help.aliyun.com/zh/isi/product-overview/billing)），一集约 1700 个中文字符。
- 无需 GPU 租赁、无需 GPT-4.1/Gemini API 调用。
