# Grounding rules (anti-hallucination)

Adapted from showlab/PaperTalker's slide-generation prompts, which explicitly call out fabrication as the main failure mode when compressing a long source into slides.

1. **Every number, quote, or claim on a slide must trace back to the source.** If the source doesn't give an exact figure, don't invent one — say it qualitatively ("大幅提升") instead of a fabricated "37%".
2. **Compression is allowed, distortion is not.** You can and should cut detail to fit a slide, but the core method/data/conclusion must survive the cut — don't simplify a hedged claim into an absolute one, or an absolute one into a hedge, to make it read more cleanly.
3. **`quote` slides need a real quote.** The `quote` field should be a direct quotation or a very tight paraphrase of one specific sentence in the source — not a synthesized "spirit of the argument" line. Attribute it (`attribution` field) to the actual person/org who said it.
4. **`table` cells need real data.** Every cell must correspond to a number or fact stated in the source. If you don't have a real value for a cell, don't estimate one — drop that row/column or drop the table slide entirely (see skeletons.md).
5. **Don't attribute claims to the wrong party.** If a paper/article cites someone else's finding, keep that attribution straight — don't let it read as the primary source's own claim.
6. **Narration tone**: first-person explainer, formal but plain (正式但通俗), no tangents into unrelated background. Matches PaperTalker's subtitle-generation prompt: "Do not explain content unrelated to the paper."
7. **When in doubt about a number, cut it** — a slide with fewer, verified facts is better than one padded with plausible-sounding invented specifics.
