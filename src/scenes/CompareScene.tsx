import React from "react";
import { useCurrentFrame } from "remotion";
import type { CompareSlide } from "../content/types";
import { colors } from "../theme";
import { revealStyle } from "../components/reveal";

const Column: React.FC<{
  label: string;
  items: string[];
  accent: string;
  frame: number;
  startFrame: number;
}> = ({ label, items, accent, frame, startFrame }) => (
  <div
    style={{
      flex: 1,
      padding: 44,
      borderRadius: 24,
      background: colors.panel,
      border: `1px solid ${colors.panelBorder}`,
      display: "flex",
      flexDirection: "column",
      gap: 26,
      ...revealStyle(frame, startFrame),
    }}
  >
    <div style={{ fontSize: 34, fontWeight: 700, color: accent }}>{label}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            fontSize: 34,
            fontWeight: 500,
            color: colors.text,
            lineHeight: 1.45,
            ...revealStyle(frame, startFrame + 10 + i * 8),
          }}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

export const CompareScene: React.FC<{ slide: CompareSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
      <div style={{ fontSize: 68, fontWeight: 900, color: colors.text, ...revealStyle(frame, 0) }}>
        {slide.heading}
      </div>
      <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
        <Column label={slide.left.label} items={slide.left.items} accent={colors.textDim} frame={frame} startFrame={14} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 100 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: colors.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              ...revealStyle(frame, 30),
            }}
          >
            VS
          </div>
        </div>
        <Column label={slide.right.label} items={slide.right.items} accent={colors.accent} frame={frame} startFrame={22} />
      </div>
    </div>
  );
};
