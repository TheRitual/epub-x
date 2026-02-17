import type { FrameStyle } from "./types.js";

export const FRAME_STYLE_SINGLE: FrameStyle = {
  topLeft: "╭",
  topRight: "╮",
  bottomLeft: "╰",
  bottomRight: "╯",
  horizontal: "─",
  vertical: "│",
  dividerLeft: "├",
  dividerCross: "┼",
  dividerRight: "┤",
};

export const FRAME_STYLE_DOUBLE: FrameStyle = {
  topLeft: "╔",
  topRight: "╗",
  bottomLeft: "╚",
  bottomRight: "╝",
  horizontal: "═",
  vertical: "║",
  dividerLeft: "╠",
  dividerCross: "╬",
  dividerRight: "╣",
};

export const FRAME_STYLE_ROUNDED: FrameStyle = {
  topLeft: "╭",
  topRight: "╮",
  bottomLeft: "╰",
  bottomRight: "╯",
  horizontal: "─",
  vertical: "│",
  dividerLeft: "├",
  dividerCross: "┼",
  dividerRight: "┤",
};

export const FRAME_STYLE_MINIMAL: FrameStyle = {
  topLeft: "┌",
  topRight: "┐",
  bottomLeft: "└",
  bottomRight: "┘",
  horizontal: "─",
  vertical: "│",
  dividerLeft: "├",
  dividerCross: "┼",
  dividerRight: "┤",
};

export const FRAME_STYLE_THICK: FrameStyle = {
  topLeft: "┏",
  topRight: "┓",
  bottomLeft: "┗",
  bottomRight: "┛",
  horizontal: "━",
  vertical: "┃",
  dividerLeft: "┣",
  dividerCross: "╋",
  dividerRight: "┫",
};

export const FRAME_STYLE_HEAVY: FrameStyle = {
  topLeft: "┏",
  topRight: "┓",
  bottomLeft: "┗",
  bottomRight: "┛",
  horizontal: "━",
  vertical: "┃",
  dividerLeft: "┣",
  dividerCross: "╋",
  dividerRight: "┫",
};

export type FrameStyleId =
  | "single"
  | "double"
  | "rounded"
  | "minimal"
  | "thick"
  | "heavy";

export const FRAME_STYLES: Record<FrameStyleId, FrameStyle> = {
  single: FRAME_STYLE_SINGLE,
  double: FRAME_STYLE_DOUBLE,
  rounded: FRAME_STYLE_ROUNDED,
  minimal: FRAME_STYLE_MINIMAL,
  thick: FRAME_STYLE_THICK,
  heavy: FRAME_STYLE_HEAVY,
};

export function getFrameStyleById(id: FrameStyleId): FrameStyle {
  return FRAME_STYLES[id] ?? FRAME_STYLE_SINGLE;
}
