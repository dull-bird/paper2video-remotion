import type { Slide } from "./types";

export const DECK_ID = "scaling-laws-carefully";
export const DECK_TITLE = "Scaling Laws, Carefully";

export const slides: Slide[] = [
  {
    id: "01-title",
    kind: "title",
    eyebrow: "Lil'Log · Lilian Weng",
    title: "Scaling Laws, Carefully",
    subtitle: "一条定律如何统治大模型时代，又因何被悄悄改写",
    photo: "images/scaling-laws-carefully/lilian-weng.jpg",
    intro: [
      "前 OpenAI 研究副总裁 · 北大本科 · 印第安纳大学博士",
      "热门技术博客 Lil'Log 作者",
      "最新观点：Scaling Law 不是铁律，数据墙正在改写它",
    ],
    narration:
      "大家好。今天我们要聊的是 Lilian Weng 翁荔的最新思考。在她离开 OpenAI 后写的这篇《Scaling Laws, Carefully》里，她提出一个核心判断：Scaling Law 并不是一条铁的定律，而是一条正在受到数据墙挑战的经验法则。翁荔是北大本科、印第安纳大学博士，前 OpenAI 研究副总裁，也是知名博客 Lil'Log 的作者。这篇文章讲的不只是一条公式，而是整整一段大模型行业的历史。",
  },
  {
    id: "02-why-it-matters",
    kind: "bullets",
    heading: "Scaling Law 为什么重要",
    tag: "Story",
    bullets: [
      "它是大模型时代的「天气预报」：用小实验外推大模型表现",
      "它是资源分配的「预算表」：决定参数与数据怎么花钱",
      "它直接塑造了 GPT-3 到 GPT-4 的「堆参数」路线",
      "但这条定律本身，却比想象中更脆弱",
    ],
    narration:
      "Scaling Law 之所以重要，是因为它是大模型时代的天气预报和预算表。你先用小模型做一堆实验，拟合出一条曲线，就能预测百亿、千亿参数模型需要多少数据和算力。GPT-3 那一代之所以疯狂堆参数，很大程度上就是这条定律在指路。但翁荔想提醒我们：这条定律本身，可能比我们以为的更脆弱。",
  },
  {
    id: "03-what-is-scaling-law",
    kind: "bullets",
    heading: "什么是 Scaling Law",
    tag: "Definition",
    bullets: [
      "核心观察：训练损失 L 随模型规模 N、数据量 D、算力 C 幂律下降",
      "在 log-log 坐标上，这些关系近似成一条直线",
      "符号约定：N 参数、D token、C 为训练 FLOPs",
      "近似公式：C ≈ 6ND",
    ],
    narration:
      "那到底什么是 Scaling Law？核心观察非常简单：当你把模型变大、数据变多、算力变强，训练损失会以一种可预测的幂律方式下降。画在双对数坐标上，就是一条漂亮的直线。这里 N 是参数量，D 是 token 数，C 是训练总算力，三者近似满足 C 约等于六 N D。",
  },
  {
    id: "04-formula-core",
    kind: "formula",
    heading: "核心形式",
    formulas: [
      {
        latex: "C \\approx 6ND",
        caption: "训练总算力 ≈ 6 × 参数 × token",
      },
      {
        latex: "\\hat{L}(N, D) = \\left[ \\left(\\frac{a}{N}\\right)^{\\alpha/\\beta} + \\frac{b}{D} \\right]^\\beta",
        caption: "Kaplan 2020 给出的联合损失形式",
      },
    ],
    footnote: "只要 N、D、C 一起增长，损失就会沿幂律下降",
    narration:
      "公式层面，最常用的是这个 C 约等于六 N D。它背后的意思是：每个 token 前向和反向大约需要六倍参数量的浮点运算。Kaplan 在他们的论文里还写了一个更完整的联合损失形式，把 N 和 D 同时放进一个幂律方程。这两个式子，构成了后来整个行业做预算的基础。",
  },
  {
    id: "05-kaplan-image",
    kind: "image",
    heading: "Kaplan et al. 2020",
    src: "images/scaling-laws-carefully/kaplan-1.png",
    caption: "OpenAI 论文中的三条幂律曲线：算力、数据、参数",
    objectFit: "contain",
    narration:
      "这是 Kaplan 等人二零二零年论文里的核心图。三张图分别展示了测试损失如何随算力、数据量和参数规模下降。注意坐标轴都是对数尺度，所以这些曲线看起来是直线。这个结果的震撼之处在于：它跨越了很多个数量级，而且趋势非常稳定。",
  },
  {
    id: "06-kaplan-conclusion",
    kind: "formula",
    heading: "Kaplan 的结论",
    formulas: [
      {
        latex: "N_{\\text{opt}} \\propto C^{0.73}",
        caption: "模型应比数据增长更快",
      },
      {
        latex: "D_{\\text{opt}} \\propto C^{0.27}",
        caption: "数据增长相对较慢",
      },
    ],
    footnote: "换言之：做大模型，然后提前停止训练",
    narration:
      "Kaplan 论文最被广泛引用的结论是这个：对于固定的算力预算，最优模型规模应该和算力的零点七三次方成正比，而数据量只和零点二七次方成正比。翻译成人话就是：钱应该主要花在参数上，数据不用那么多，模型做到够大然后提前停就行。这个结论后来被 GPT-3 那一代奉为圭臬。",
  },
  {
    id: "07-chinchilla-image",
    kind: "image",
    heading: "Chinchilla 2022",
    src: "images/scaling-laws-carefully/chinchilla-2.png",
    caption: "DeepMind 用三种独立方法重新拟合 Scaling Law",
    objectFit: "contain",
    narration:
      "两年后，DeepMind 发表了 Chinchilla。他们没有直接反驳 Kaplan，而是用了三种独立的方法重新做了一遍实验：固定模型大小改变数据量、IsoFLOP 曲线、以及参数化拟合。结果三种方法指向了同一个方向，而且和 Kaplan 的结论明显不同。",
  },
  {
    id: "08-chinchilla-conclusion",
    kind: "formula",
    heading: "Chinchilla 的结论",
    formulas: [
      {
        latex: "N_{\\text{opt}} \\propto C^{0.50}",
        caption: "模型与数据等比例增长",
      },
      {
        latex: "D_{\\text{opt}} \\propto C^{0.50}",
        caption: "数据不再是被压缩的变量",
      },
    ],
    footnote: "Chinchilla：70B 参数 + 1.4T tokens，反超 Gopher",
    narration:
      "Chinchilla 得出的结论是，最优模型规模和最优数据量都应该和算力的零点五次方成正比，也就是说，模型和数据要大致等比例增长。按这个逻辑，DeepMind 训练了一个只有七十亿参数、但用了一点四万亿 token 的模型，结果在同样算力下全面打败了二百八十亿参数的 Gopher。",
  },
  {
    id: "09-model-comparison",
    kind: "image",
    heading: "同算力下，谁更优",
    src: "images/scaling-laws-carefully/chinchilla-4.png",
    caption: "Chinchilla 三种方法 vs Kaplan 虚线；星星是真实模型",
    objectFit: "contain",
    narration:
      "这张图把两套结论画在了一起。虚线是 Kaplan 的预测，三条实线是 Chinchilla 的三种方法，星星是真实存在的模型。你可以清楚看到，GPT-3、Gopher、Megatron 都落在 Kaplan 线上方，也就是被预测成需要更大参数的位置；而 Chinchilla 自己则在实线附近。这说明行业当时主流的大模型，其实都被训练得太大、太欠练。",
  },
  {
    id: "10-kaplan-vs-chinchilla",
    kind: "compare",
    heading: "两套定律的核心分歧",
    left: {
      label: "Kaplan et al. 2020",
      items: [
        "N_opt ∝ C^0.73",
        "优先做大模型",
        "训练到收敛前停止",
      ],
    },
    right: {
      label: "Chinchilla 2022",
      items: [
        "N_opt ∝ C^0.50",
        "模型与数据等比例",
        "小模型也能更强",
      ],
    },
    narration:
      "所以两套 Scaling Law 的核心分歧可以概括成这样：Kaplan 认为最优模型规模随算力的零点七三次方增长，所以应该优先做大模型；Chinchilla 认为是零点五次方，所以应该让小模型吃更多数据。这个分歧直接决定了GPT-3 到 Chinchilla 之间，整个行业在参数和数据之间怎么分配预算。",
  },
  {
    id: "11-why-different",
    kind: "compare",
    heading: "为什么结论不同",
    left: {
      label: "主流解释",
      items: [
        "Pearce & Song 2024",
        "Kaplan 未计入嵌入参数",
        "参数统计口径不同",
      ],
    },
    right: {
      label: "Diogo 的反驳",
      items: [
        "实验设计本身有 bug",
        "固定 token + cosine 到 0",
        "让结果看起来与 LR 无关",
      ],
    },
    narration:
      "对于为什么两套结论不同，学界有一个主流解释：Kaplan 统计的是非嵌入参数，而 Chinchilla 统计的是总参数。Pearce 和 Song 二零二四年的论文试图用这个口径差异把两者调和起来。但 Diogo Almeida 在《Scaling Laws, Honestly》里反驳说，真正的问题不是口径，而是实验设计本身有 bug：所有模型用固定 token 数训练，学习率衰减到零，然后作者又说结果与学习率调度无关。",
  },
  {
    id: "12-pearce-harmonization",
    kind: "image",
    heading: "Pearce & Song 的调和工作",
    src: "images/scaling-laws-carefully/pearce-1.png",
    caption: "局部指数 g 随算力变化，在小规模区间接近 0.73",
    objectFit: "contain",
    narration:
      "不过 Pearce 和 Song 的调和也不是没有道理。他们发现，如果考虑嵌入参数的影响，在小规模区间局部拟合出来的指数确实会接近 Kaplan 的零点七三，但随着算力变大，指数会逐渐收敛到 Chinchilla 的零点五。换句话说，两套结论可能都是某个更大规律在不同区间的近似。",
  },
  {
    id: "13-data-wall",
    kind: "bullets",
    heading: "撞上数据墙之后",
    tag: "Data Wall",
    bullets: [
      "经典 Scaling Law 假设有无限唯一数据",
      "现实：高质量 token 正成为稀缺资源",
      "重复数据会让测试损失出现「双下降」",
      "数据受限区正在改写 Scaling Law 的形式",
    ],
    narration:
      "除了两套结论谁对谁错，Scaling Law 今天还面临另一个更现实的挑战：数据墙。经典定律假设你有无穷无尽的、不重复的高质量数据。但现实是，互联网上的优质文本是有限的。当模型继续变大，我们不得不重复训练同样的数据，而这会让损失曲线出现新的现象。",
  },
  {
    id: "14-repetition-effect",
    kind: "image",
    heading: "重复数据的影响",
    src: "images/scaling-laws-carefully/muennighoff-1.png",
    caption: "Muennighoff 2023：重复 token 的价值会指数衰减",
    objectFit: "contain",
    narration:
      "这是 Muennighoff 等人二零二三年的实验。左图显示：随着唯一数据比例下降，模型损失会逐渐上升。右图则是他们提出的数据受限 Scaling Law：重复数据的价值并不是线性的，而是指数衰减。也就是说，重复十遍不如新增一倍数据。这个发现直接威胁到「无限数据」这个基础假设。",
  },
  {
    id: "15-lovelace-penalty",
    kind: "image",
    heading: "过拟合惩罚与模型规模相关",
    src: "images/scaling-laws-carefully/lovelace-1.png",
    caption: "Lovelace 2026：大模型对重复数据更敏感",
    objectFit: "contain",
    narration:
      "更近的 Lovelace 等人二零二六年的研究进一步发现：重复数据带来的惩罚不仅取决于重复次数，还取决于模型相对唯一数据的大小。图里越往右的模型越大，损失惩罚上升得越陡峭。这意味着，在数据有限的世界里，盲目堆参数会越来越吃亏。",
  },
  {
    id: "16-tricky-fitting",
    kind: "bullets",
    heading: "拟合 Scaling Law 有多敏感",
    tag: "Pitfalls",
    bullets: [
      "只在小模型上拟合，却外推多个数量级",
      "参数计数方式会改变拟合出的指数",
      "loss 保留几位小数都会影响结果",
      "Huber loss 平均 vs 求和，会导致优化提前终止",
    ],
    narration:
      "最后翁荔想强调的，是拟合 Scaling Law 这件事本身有多敏感。你只在能跑得起的小模型上做实验，却要外推到数量级更大的模型；参数怎么数、loss 保留几位小数、Huber loss 是求和还是平均，都会影响最终结论。Besiroglu 等人复现 Chinchilla 时就发现，原文把 Huber loss 按样本平均，导致优化器提前停止，这成了方法三稍微偏离另外两个方法的原因之一。",
  },
  {
    id: "17-conclusion",
    kind: "bullets",
    heading: "结论与启示",
    tag: "Conclusion",
    bullets: [
      "Scaling Law 是强大但脆弱的经验工具",
      "Kaplan 与 Chinchilla 的分歧来自实验细节",
      "无限数据假设正被数据墙挑战",
      "Carefully 不仅是一个标题，更是一种态度",
    ],
    narration:
      "所以回到标题，《Scaling Laws, Carefully》。Carefully 不仅是一个标题，更是一种态度。Scaling Law 是一个强大的经验工具，但它也很脆弱：实验细节会改变结论，数据假设会受现实挑战。下次再看到有人说「按 Scaling Law，我们应该把模型做到多大」时，也许应该先问一句：你用的是哪一版 Scaling Law？数据够唯一吗？",
  },
  {
    id: "18-end",
    kind: "end",
    heading: "参考资料",
    lines: [
      "原文：Scaling Laws, Carefully — Lilian Weng",
      "核心反驳：Scaling Laws, Honestly — Diogo Almeida",
      "Kaplan et al. 2020 · arXiv:2001.08361",
      "Hoffmann et al. 2022 (Chinchilla) · arXiv:2203.15556",
      "Pearce & Song 2024 · Besiroglu et al. 2024",
    ],
    narration:
      "以上就是这期内容的核心。想深入了解的话，推荐读 Lilian Weng 的原文，以及 Diogo Almeida 那篇《Scaling Laws, Honestly》。感谢观看。",
  },
];
