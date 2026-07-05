import React from "react";
import { useCurrentFrame } from "remotion";
import type { QuoteSlide } from "../content/types";
import { colors } from "../theme";
import { revealStyle } from "../components/reveal";

export const QuoteScene: React.FC<{ slide: QuoteSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center", textAlign: "center" }}>
      <div style={{ fontSize: 64, fontWeight: 900, color: colors.text, ...revealStyle(frame, 0) }}>
        {slide.heading}
      </div>

      <div
        style={{
          maxWidth: 1500,
          padding: "56px 72px",
          borderRadius: 28,
          background: colors.panel,
          border: `1px solid ${colors.panelBorder}`,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          ...revealStyle(frame, 18),
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 700, color: colors.text, lineHeight: 1.5 }}>
          「{slide.quote}」
        </div>
        {slide.quoteEn ? (
          <div style={{ fontSize: 34, fontWeight: 500, color: colors.accent, fontStyle: "italic" }}>
            {slide.quoteEn}
          </div>
        ) : null}
      </div>

      <div style={{ fontSize: 36, color: colors.textDim, maxWidth: 1300, ...revealStyle(frame, 34) }}>
        {slide.attribution}
      </div>
    </div>
  );
};
