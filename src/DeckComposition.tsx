import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Sequence,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { z } from "zod";
import type { Slide } from "./content/types";
import { SlideView } from "./scenes/SlideView";
import { SceneChrome } from "./components/SceneChrome";
import { FPS } from "./theme";
import {
  estimateDurationFromNarration,
  getAudioDuration,
} from "./get-audio-duration";

export const deckPropsSchema = z.object({
  slideDurationsFrames: z.array(z.number()).optional(),
  slideHasAudio: z.array(z.boolean()).optional(),
});

export type DeckProps = z.infer<typeof deckPropsSchema>;

const MIN_FRAMES = Math.round(2.6 * FPS);
const TAIL_PADDING_FRAMES = Math.round(0.45 * FPS);

const sceneTag = (slide: Slide) => {
  if (slide.kind === "bullets") {
    return slide.tag ?? undefined;
  }
  return undefined;
};

// 一个 deckId + slides 数组，就能生成一整套 Composition（组件 + calculateMetadata）。
// 新增一篇论文/文章：写一个新的 src/content/<id>.ts 导出 slides，调这个工厂函数，
// 在 Root.tsx 里注册一个新的 <Composition>，不用碰这个文件。
export const createDeck = (
  deckId: string,
  slides: Slide[],
  deckTitle?: string,
) => {
  const calculateDeckMetadata: CalculateMetadataFunction<DeckProps> = async ({
    props,
  }) => {
    const results = await Promise.all(
      slides.map(async (slide) => {
        const src = staticFile(`voiceover/${deckId}/${slide.id}.mp3`);
        try {
          const seconds = await getAudioDuration(src);
          return { seconds, hasAudio: true };
        } catch {
          return {
            seconds: estimateDurationFromNarration(slide.narration),
            hasAudio: false,
          };
        }
      }),
    );

    const slideDurationsFrames = results.map((r) =>
      Math.max(Math.ceil(r.seconds * FPS) + TAIL_PADDING_FRAMES, MIN_FRAMES),
    );
    const slideHasAudio = results.map((r) => r.hasAudio);

    const durationInFrames = slideDurationsFrames.reduce((a, b) => a + b, 0);

    return {
      durationInFrames,
      props: { ...props, slideDurationsFrames, slideHasAudio },
    };
  };

  const DeckComposition: React.FC<DeckProps> = ({
    slideDurationsFrames,
    slideHasAudio,
  }) => {
    const durations =
      slideDurationsFrames ??
      slides.map((s) =>
        Math.max(Math.ceil(estimateDurationFromNarration(s.narration) * FPS), MIN_FRAMES),
      );
    const hasAudioFlags = slideHasAudio ?? slides.map(() => false);

    let offset = 0;
    const items = slides.map((slide, i) => {
      const from = offset;
      const durationInFrames = durations[i];
      offset += durationInFrames;

      return (
        <Sequence key={slide.id} from={from} durationInFrames={durationInFrames}>
          <AbsoluteFill>
            <SceneChrome
              index={i}
              total={slides.length}
              tag={sceneTag(slide)}
              deckTitle={deckTitle}
            >
              <SlideView slide={slide} />
            </SceneChrome>
            {hasAudioFlags[i] ? (
              <Audio src={staticFile(`voiceover/${deckId}/${slide.id}.mp3`)} />
            ) : null}
          </AbsoluteFill>
        </Sequence>
      );
    });

    return <AbsoluteFill>{items}</AbsoluteFill>;
  };

  return { DeckComposition, calculateDeckMetadata };
};
