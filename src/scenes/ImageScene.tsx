import React from "react";
import { useCurrentFrame, Img, staticFile } from "remotion";
import type { ImageSlide } from "../content/types";
import { colors } from "../theme";
import { revealStyle } from "../components/reveal";

export const ImageScene: React.FC<{ slide: ImageSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: 54,
          fontWeight: 900,
          color: colors.text,
          lineHeight: 1.2,
          ...revealStyle(frame, 0),
        }}
      >
        {slide.heading}
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          borderRadius: 24,
          overflow: "hidden",
          background: colors.panel,
          border: `1px solid ${colors.panelBorder}`,
          ...revealStyle(frame, 14),
        }}
      >
        <Img
          src={staticFile(slide.src)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: slide.objectFit ?? "contain",
          }}
        />
      </div>
      {slide.caption ? (
        <div
          style={{
            fontSize: 26,
            lineHeight: 1.4,
            color: colors.textDim,
            ...revealStyle(frame, 28),
          }}
        >
          {slide.caption}
        </div>
      ) : null}
    </div>
  );
};
