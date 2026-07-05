import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontFamily, SAFE_X, SAFE_TOP, SAFE_BOTTOM } from "../theme";
import { Background } from "./Background";

interface SceneChromeProps {
  index: number;
  total: number;
  tag?: string;
  deckTitle?: string;
  children: React.ReactNode;
}

export const SceneChrome: React.FC<SceneChromeProps> = ({
  index,
  total,
  tag,
  deckTitle,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 0.4 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(enter, exit);
  const translateY = interpolate(enter, [0, 1], [24, 0]);

  const progress = (index + 1) / total;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Background />
      <AbsoluteFill
        style={{
          padding: `${SAFE_TOP}px ${SAFE_X}px ${SAFE_BOTTOM}px`,
          opacity,
          translate: `0px ${translateY}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 2,
              color: colors.accent,
              textTransform: "uppercase",
            }}
          >
            {tag ?? deckTitle ?? "Scaling Laws, Honestly"}
          </div>
          <div style={{ fontSize: 28, color: colors.textDim, fontWeight: 500 }}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {children}
        </div>

        <div
          style={{
            marginTop: 48,
            height: 6,
            borderRadius: 999,
            background: "#ffffff14",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${colors.accent}, ${colors.ok})`,
              borderRadius: 999,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
