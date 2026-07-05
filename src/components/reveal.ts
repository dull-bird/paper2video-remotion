import { Easing, interpolate } from "remotion";

export const revealStyle = (frame: number, startFrame: number, span = 18) => {
  const t = interpolate(frame, [startFrame, startFrame + span], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return {
    opacity: t,
    translate: `0px ${interpolate(t, [0, 1], [22, 0])}px`,
  };
};
