export type SlideKind =
  | "title"
  | "bullets"
  | "table"
  | "quote"
  | "compare"
  | "formula"
  | "image"
  | "end";

export interface BaseSlide {
  id: string;
  kind: SlideKind;
  narration: string; // 中文旁白，用于 TTS
}

export interface TitleSlide extends BaseSlide {
  kind: "title";
  eyebrow: string;
  title: string;
  subtitle: string;
  photo?: string;
  intro?: string[];
}

export interface BulletsSlide extends BaseSlide {
  kind: "bullets";
  heading: string;
  tag?: string;
  bullets: string[];
}

export interface QuoteSlide extends BaseSlide {
  kind: "quote";
  heading: string;
  quote: string;
  quoteEn?: string;
  attribution: string;
}

export interface TableSlide extends BaseSlide {
  kind: "table";
  heading: string;
  columns: string[];
  rows: string[][];
  footnote?: string;
}

export interface CompareSlide extends BaseSlide {
  kind: "compare";
  heading: string;
  left: { label: string; items: string[] };
  right: { label: string; items: string[] };
}

export interface FormulaSlide extends BaseSlide {
  kind: "formula";
  heading: string;
  formulas: Array<{ latex: string; caption?: string }>;
  footnote?: string;
}

export interface ImageSlide extends BaseSlide {
  kind: "image";
  heading: string;
  src: string;
  caption?: string;
  objectFit?: "contain" | "cover";
}

export interface EndSlide extends BaseSlide {
  kind: "end";
  heading: string;
  lines: string[];
}

export type Slide =
  | TitleSlide
  | BulletsSlide
  | QuoteSlide
  | TableSlide
  | CompareSlide
  | FormulaSlide
  | ImageSlide
  | EndSlide;
