import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../theme";

export const Background: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1200px 800px at 12% -10%, #1c2440 0%, ${colors.bg} 55%), ${colors.bg}`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(1000px 700px at 50% 30%, black 0%, transparent 75%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -220,
          top: -220,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accentSoft} 0%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
