import { loadFont } from "@remotion/google-fonts/NotoSansSC";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

export const colors = {
  bg: "#0b0f1a",
  bgAlt: "#11162400",
  panel: "#151b2c",
  panelBorder: "#2a3350",
  text: "#f4f6fb",
  textDim: "#a9b2c9",
  accent: "#5b8cff",
  accentSoft: "#5b8cff33",
  danger: "#ff6b6b",
  ok: "#4fd1a5",
  gold: "#f2c14e",
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const SAFE_X = 140;
export const SAFE_TOP = 120;
export const SAFE_BOTTOM = 120;
