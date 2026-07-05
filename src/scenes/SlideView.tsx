import React from "react";
import type { Slide } from "../content/types";
import { TitleScene } from "./TitleScene";
import { BulletsScene } from "./BulletsScene";
import { QuoteScene } from "./QuoteScene";
import { TableScene } from "./TableScene";
import { CompareScene } from "./CompareScene";
import { FormulaScene } from "./FormulaScene";
import { ImageScene } from "./ImageScene";
import { EndScene } from "./EndScene";

export const SlideView: React.FC<{ slide: Slide }> = ({ slide }) => {
  switch (slide.kind) {
    case "title":
      return <TitleScene slide={slide} />;
    case "bullets":
      return <BulletsScene slide={slide} />;
    case "quote":
      return <QuoteScene slide={slide} />;
    case "table":
      return <TableScene slide={slide} />;
    case "compare":
      return <CompareScene slide={slide} />;
    case "formula":
      return <FormulaScene slide={slide} />;
    case "image":
      return <ImageScene slide={slide} />;
    case "end":
      return <EndScene slide={slide} />;
    default:
      return null;
  }
};
