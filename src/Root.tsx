import "./index.css";
import { Composition } from "remotion";
import { createDeck } from "./DeckComposition";
import {
  slides as scalingLawsSlides,
  DECK_ID as scalingLawsId,
  DECK_TITLE as scalingLawsTitle,
} from "./content/scaling-laws";
import {
  slides as scalingLawsCarefullySlides,
  DECK_ID as scalingLawsCarefullyId,
  DECK_TITLE as scalingLawsCarefullyTitle,
} from "./content/scaling-laws-carefully";
import { WIDTH, HEIGHT, FPS } from "./theme";

const scalingLaws = createDeck(scalingLawsId, scalingLawsSlides, scalingLawsTitle);
const scalingLawsCarefully = createDeck(
  scalingLawsCarefullyId,
  scalingLawsCarefullySlides,
  scalingLawsCarefullyTitle,
);

// 新增一篇论文/文章：
// 1. 写 src/content/<id>.ts，导出 slides（见 scaling-laws.ts 的结构）和 DECK_ID
// 2. import 进来，createDeck(id, slides) 生成一份
// 3. 在下面加一个 <Composition>，id 用大驼峰命名

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ScalingLawsHonestly"
        component={scalingLaws.DeckComposition}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={300}
        defaultProps={{}}
        calculateMetadata={scalingLaws.calculateDeckMetadata}
      />
      <Composition
        id="ScalingLawsCarefully"
        component={scalingLawsCarefully.DeckComposition}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={300}
        defaultProps={{}}
        calculateMetadata={scalingLawsCarefully.calculateDeckMetadata}
      />
    </>
  );
};
