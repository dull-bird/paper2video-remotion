import React from "react";
import { useCurrentFrame } from "remotion";
import type { EndSlide } from "../content/types";
import { colors } from "../theme";
import { revealStyle } from "../components/reveal";

export const EndScene: React.FC<{ slide: EndSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
      <div style={{ fontSize: 72, fontWeight: 900, color: colors.text, ...revealStyle(frame, 0) }}>
        {slide.heading}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {slide.lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: 34,
              fontWeight: 500,
              color: colors.textDim,
              lineHeight: 1.5,
              display: "flex",
              gap: 18,
              ...revealStyle(frame, 14 + i * 10),
            }}
          >
            <span style={{ color: colors.accent }}>→</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};
