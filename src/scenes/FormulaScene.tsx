import React from "react";
import { useCurrentFrame } from "remotion";
import { BlockMath } from "react-katex";
import type { FormulaSlide } from "../content/types";
import { colors } from "../theme";
import { revealStyle } from "../components/reveal";
import "katex/dist/katex.min.css";

export const FormulaScene: React.FC<{ slide: FormulaSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div
        style={{
          fontSize: 68,
          fontWeight: 900,
          color: colors.text,
          ...revealStyle(frame, 0),
        }}
      >
        {slide.heading}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {slide.formulas.map((f, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              ...revealStyle(frame, 14 + i * 14),
            }}
          >
            <div
              style={{
                fontSize: 40,
                color: colors.text,
                padding: "28px 36px",
                background: colors.panel,
                border: `1px solid ${colors.panelBorder}`,
                borderRadius: 20,
              }}
            >
              <BlockMath math={f.latex} />
            </div>
            {f.caption ? (
              <div
                style={{
                  fontSize: 28,
                  color: colors.textDim,
                  paddingLeft: 12,
                }}
              >
                {f.caption}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {slide.footnote ? (
        <div
          style={{
            fontSize: 26,
            color: colors.textDim,
            marginTop: 12,
            ...revealStyle(frame, 28 + slide.formulas.length * 14),
          }}
        >
          {slide.footnote}
        </div>
      ) : null}
    </div>
  );
};
