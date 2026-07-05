import React from "react";
import { useCurrentFrame } from "remotion";
import type { TableSlide } from "../content/types";
import { colors } from "../theme";
import { revealStyle } from "../components/reveal";

export const TableScene: React.FC<{ slide: TableSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      <div style={{ fontSize: 68, fontWeight: 900, color: colors.text, ...revealStyle(frame, 0) }}>
        {slide.heading}
      </div>

      <div
        style={{
          borderRadius: 24,
          overflow: "hidden",
          border: `1px solid ${colors.panelBorder}`,
          ...revealStyle(frame, 14),
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1.1fr repeat(${slide.columns.length - 1}, 1.4fr)`,
          }}
        >
          {slide.columns.map((col, i) => (
            <div
              key={i}
              style={{
                padding: "26px 32px",
                background: "#1c2440",
                fontSize: 32,
                fontWeight: 700,
                color: colors.textDim,
              }}
            >
              {col}
            </div>
          ))}

          {slide.rows.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                style={{
                  padding: "30px 32px",
                  background: rIdx % 2 === 0 ? colors.panel : "#10152238",
                  borderTop: `1px solid ${colors.panelBorder}`,
                  fontSize: 38,
                  fontWeight: cIdx === 0 ? 700 : 500,
                  color: cIdx === 2 ? colors.ok : colors.text,
                  ...revealStyle(frame, 22 + rIdx * 10),
                }}
              >
                {cell}
              </div>
            )),
          )}
        </div>
      </div>

      {slide.footnote ? (
        <div style={{ fontSize: 34, color: colors.gold, fontWeight: 600, ...revealStyle(frame, 60) }}>
          {slide.footnote}
        </div>
      ) : null}
    </div>
  );
};
