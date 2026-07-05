import React from "react";
import { useCurrentFrame } from "remotion";
import type { BulletsSlide } from "../content/types";
import { colors } from "../theme";
import { revealStyle } from "../components/reveal";

export const BulletsScene: React.FC<{ slide: BulletsSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
      <div style={{ fontSize: 72, fontWeight: 900, color: colors.text, ...revealStyle(frame, 0) }}>
        {slide.heading}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {slide.bullets.map((bullet, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 24,
              ...revealStyle(frame, 14 + i * 12),
            }}
          >
            <div
              style={{
                marginTop: 10,
                width: 16,
                height: 16,
                borderRadius: "50%",
                flexShrink: 0,
                background: colors.accent,
                boxShadow: `0 0 0 6px ${colors.accentSoft}`,
              }}
            />
            <div style={{ fontSize: 42, fontWeight: 500, color: colors.text, lineHeight: 1.5 }}>
              {bullet}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
