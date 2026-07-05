import type { Slide } from "./types";

export const DECK_ID = "scaling-laws";
export const DECK_TITLE = "Scaling Laws, Honestly";

export const slides: Slide[] = [
  {
    id: "01-title",
    kind: "title",
    eyebrow: "Complete Skeptic · Diogo Almeida",
    title: "Scaling Laws, Honestly",
    subtitle: "原始 Scaling Law 的一个 bug，如何让全行业多烧了两年算力",
    narration:
      "大家好。今天要讲的这篇文章标题是《Scaling Laws, Honestly》，作者 Diogo Almeida，当年正是在 OpenAI 做大模型优化的研究员。他抛出一个说法：最初那版 Scaling Law，也就是 Kaplan et al. 二零二零年的原始论文，其实是错的，根源是一个 bug。",
  },
  {
    id: "02-background",
    kind: "bullets",
    heading: "背景：Scaling Law 为什么重要",
    tag: "Background",
    bullets: [
      "预测能力：用少量小规模实验拟合曲线，外推大模型需要的算力、数据与参数量",
      "调试能力：投入指数级资源训练时，用曲线判断训练是否正常",
      "它定义了 GPT-3 那一代「堆参数」的路线，也支撑起了今天的 LLM 时代",
      "导火索：Lilian Weng 翁荔 新发博客《Scaling Laws, Carefully》，其中一节专门调和 Kaplan 与 Chinchilla 的分歧",
    ],
    narration:
      "Scaling Law 之所以重要，是因为它同时具备预测和调试两种能力。用少量小规模实验拟合出一条曲线，就能外推大模型需要多少算力、数据和参数。这套逻辑直接定义了 GPT 三那一代堆参数的路线。这次讨论的导火索，是翁荔最近发的一篇博客，《Scaling Laws, Carefully》，里面专门有一节在调和 Kaplan 原版和 DeepMind Chinchilla 之间的分歧。",
  },
  {
    id: "03-mainstream-vs-truth",
    kind: "compare",
    heading: "主流解释 vs 真正原因",
    left: {
      label: "学界主流解释",
      items: [
        "Kaplan 与 Chinchilla 结论不同",
        "原因：两者统计参数总数 N 的方式不一样",
        "这是被广泛接受的「口径差异」说法",
      ],
    },
    right: {
      label: "Diogo 的说法",
      items: [
        "口径差异不是真正原因",
        "真正原因：原始论文里藏着一个 bug",
        "不怪作者，是被实验设计本身误导了",
      ],
    },
    narration:
      "学界主流解释认为，Kaplan 和 Chinchilla 结论不同，是因为两边统计参数总数的方式不一样。但 Diogo 站出来说，这个解释并不准确。真正的原因，是原始论文里藏着一个 bug。他强调，这不怪原作者，是被当时的实验设计本身误导了。",
  },
  {
    id: "04-clue",
    kind: "quote",
    heading: "关键线索：数据要随模型规模一起放大",
    quote: "两套 Scaling Law 都预测，数据量 D 应该随模型规模 N 一起增长。",
    quoteEn: "Data scales with size.",
    attribution: "模型越大，吸收数据的容量也越大 —— 所以数据量是极其关键的变量",
    narration:
      "要理解这个 bug，有一条关键线索：无论是 Kaplan 版本还是 Chinchilla 版本，都预测数据量应该随模型规模一起增长。直觉很简单，模型越大，能吸收的数据也越多。所以数据量本该是一个极其关键的变量，而原始论文恰恰在这个变量上出了问题。",
  },
  {
    id: "05-step1",
    kind: "bullets",
    heading: "Bug 三步曲 · 第一步",
    tag: "Step 1",
    bullets: [
      "对所有模型使用固定的训练 token 数：约 130B tokens",
      "小模型：相对自身容量被「喂饱」甚至「喂撑」",
      "大模型：同样 130B tokens 下严重「营养不良」",
      "光这一条，就足以得出错误的 Scaling Law",
    ],
    narration:
      "第一步：对所有模型使用固定的训练数据量，大约一千三百亿 token。小模型在这个数据量下相对自己的容量被喂得很饱，甚至喂撑了；而大模型在同样的一千三百亿 token 下，严重营养不良，远没训练到位。光这一条，就足以让 Scaling Law 出错。",
  },
  {
    id: "06-step2",
    kind: "bullets",
    heading: "Bug 三步曲 · 第二步",
    tag: "Step 2",
    bullets: [
      "使用余弦学习率衰减（cosine decay），让 LR 平滑趋近于 0",
      "训练接近终点时，学习率被摁到零，性能自然「走平」",
      "看上去像模型已经「饱和」，再喂数据也没用",
      "但大模型本可以在更多数据下继续变强 —— 是 LR 调度人为掐断了成长",
    ],
    narration:
      "第二步：使用余弦学习率衰减，让学习率在训练接近终点时平滑地趋近于零。这样一来，性能自然走平，看上去就像模型已经饱和，再喂数据也没用了。但我们现在知道，大模型本可以在更多数据下继续变强，是学习率调度人为地掐断了它的成长。",
  },
  {
    id: "07-step3",
    kind: "quote",
    heading: "Bug 三步曲 · 第三步",
    quote: "结果「基本不受学习率调度影响」",
    quoteEn: "largely independent of learning rate schedule",
    attribution: "在固定 token 上限下技术上正确，但不适用于「无限数据极限」的理想世界",
    narration:
      "第三步，也是最容易被忽略的一步：原文写道，结果基本不受学习率调度影响。在给定最大 token 数的前提下，这个结论技术上完全正确，但它并不适用于 Scaling Law 真正想描述的那个无限数据极限的理想世界。三步叠加，就得到了一条既错、又极难 debug 的定律。就连 Diogo 自己都承认，他当年也在 OpenAI 做优化，也没看出这个 bug —— 那条学习率曲线看起来太像是精心设定的了。",
  },
  {
    id: "08-result-table",
    kind: "table",
    heading: "后果：模型被训得又大又欠练",
    columns: ["对比项", "GPT-3（原版 Kaplan）", "Chinchilla（DeepMind）"],
    rows: [
      ["参数量 N", "175B（虚胖）", "70B（不到 GPT-3 一半）"],
      ["训练数据 D", "~300B tokens", "1.4T tokens（4 倍多）"],
      ["同算力表现", "被反超", "全面胜出"],
    ],
    footnote: "同一笔算力，一个被养成「虚胖壮汉」，一个被练成「精瘦拳手」",
    narration:
      "看后果就很直观了。同样是算力预算，GPT 三用了一千七百五十亿参数，却只喂了大约三千亿 token，属于虚胖；Chinchilla 只用了七百亿参数，不到 GPT 三的一半，却喂了一点四万亿 token，是四倍多，结果同样算力下全面反超。同一笔算力，一个被养成了虚胖壮汉，一个被练成了精瘦拳手。",
  },
  {
    id: "09-conclusion",
    kind: "bullets",
    heading: "结论与启示",
    tag: "Conclusion",
    bullets: [
      "这个 bug 最终被发现，但据作者所知，从未被公开明确承认",
      "如今每个大厂早就心知肚明",
      "给非大厂研究者的建议：别在这个问题上浪费时间，Chinchilla 才是对的",
      "呼吁：谁能修订原始论文，最好加一条 note 说明这里有 bug",
    ],
    narration:
      "这个 bug 最终被发现了，但据作者所知，从未被公开明确承认过，如今每个大厂其实都早已心知肚明。Diogo 给非大厂研究者的建议是：别再在这个问题上浪费时间了，Chinchilla 的 Scaling Law 才是对的。他也呼吁，如果谁能修订原始论文，最好加一条注释，说明这里曾经有过一个 bug。",
  },
  {
    id: "10-end",
    kind: "end",
    heading: "参考资料",
    lines: [
      "一手原文：Scaling Laws, Honestly — Diogo Almeida (Complete Skeptic)",
      "引发讨论：Scaling Laws, Carefully — Lilian Weng (Lil'Log)",
      "Kaplan et al. 2020 · arXiv:2001.08361",
      "Hoffmann et al. 2022（Chinchilla）· arXiv:2203.15556",
      "Besiroglu et al. 2024（复现研究）· arXiv:2404.10102",
    ],
    narration:
      "以上就是这篇文章的核心内容。感兴趣的话，可以去读一手原文 Scaling Laws Honestly，作者 Diogo Almeida，以及引发这次讨论的翁荔的博客 Scaling Laws Carefully。感谢观看。",
  },
];
