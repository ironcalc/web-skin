interface CellStyleFill {
  pattern_type: string;
  fg_color?: string;
  bg_color?: string;
}

interface CellStyleFont {
  u: boolean;
  b: boolean;
  i: boolean;
  strike: boolean;
  sz: number;
  color: string;
  name: string;
  family: number;
  scheme: string;
}

export enum BorderType {
  BorderAll,
  BorderInner,
  BorderCenterH,
  BorderCenterV,
  BorderOuter,
  BorderNone,
  BorderTop,
  BorderRight,
  BorderBottom,
  BorderLeft,
  None,
}

export interface BorderOptions {
  color: string;
  style: BorderStyle;
  border: BorderType;
}
export enum BorderStyle {
  Thin = "thin",
  Medium = "medium",
  Thick = "thick",
  Dashed = "dashed",
  Dotted = "dotted",
  Double = "double",
  None = "none",
}

interface BorderItem {
  style: string;
  color: string;
}

interface CellStyleBorder {
  diagonal_up?: boolean;
  diagonal_down?: boolean;
  left: BorderItem;
  right: BorderItem;
  top: BorderItem;
  bottom: BorderItem;
  diagonal: BorderItem;
}

export type VerticalAlignment = "bottom" | "center" | "distributed" | "justify" | "top";

export type HorizontalAlignment =
  | "left"
  | "center"
  | "right"
  | "general"
  | "centerContinuous"
  | "distributed"
  | "fill"
  | "justify";

interface Alignment {
  horizontal: HorizontalAlignment;
  vertical: VerticalAlignment;
  wrap_text: boolean;
}

export interface CellStyle {
  read_only: boolean;
  quote_prefix: boolean;
  fill: CellStyleFill;
  font: CellStyleFont;
  border: CellStyleBorder;
  num_fmt: string;
  alignment?: Alignment;
}
