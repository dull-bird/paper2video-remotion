import React from "react";
import { useCurrentFrame, Img, staticFile } from "remotion";
import type { TitleSlide } from "../content/types";
import { colors } from "../theme";
import { revealStyle } from "../components/reveal";

export const TitleScene: React.FC<{ slide: TitleSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const hasPhoto = Boolean(slide.photo);

  if (!hasPhoto) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 28 }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: colors.gold,
            letterSpacing: 1,
            ...revealStyle(frame, 0),
          }}
        >
          {slide.eyebrow}
        </div>
        <div
          style={{
            fontSize: 128,
            fontWeight: 900,
            color: colors.text,
            lineHeight: 1.08,
            maxWidth: 1400,
            ...revealStyle(frame, 10),
          }}
        >
          {slide.title}
        </div>
        <div
          style={{
            fontSize: 46,
            fontWeight: 500,
            color: colors.textDim,
            maxWidth: 1300,
            lineHeight: 1.5,
            ...revealStyle(frame, 24),
          }}
        >
          {slide.subtitle}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 72,
        height: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: colors.gold,
            letterSpacing: 1,
            ...revealStyle(frame, 0),
          }}
        >
          {slide.eyebrow}
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: colors.text,
            lineHeight: 1.08,
            ...revealStyle(frame, 10),
          }}
        >
          {slide.title}
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 500,
            color: colors.textDim,
            lineHeight: 1.45,
            maxWidth: 1000,
            ...revealStyle(frame, 22),
          }}
        >
          {slide.subtitle}
        </div>
        {slide.intro ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginTop: 16,
              ...revealStyle(frame, 34),
            }}
          >
            {slide.intro.map((line, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 28,
                  fontWeight: 500,
                  color: colors.textDim,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: colors.accent,
                    flexShrink: 0,
                  }}
                />
                <span>{line}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div
        style={{
          flexShrink: 0,
          width: 380,
          height: 380,
          borderRadius: "50%",
          overflow: "hidden",
          border: `4px solid ${colors.accent}`,
          boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
          ...revealStyle(frame, 18),
        }}
      >
        <Img
          src={staticFile(slide.photo!)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};
