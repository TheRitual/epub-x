export interface FrameStyle {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  horizontal: string;
  vertical: string;
  dividerLeft: string;
  dividerCross: string;
  dividerRight: string;
}

export interface CliThemeColors {
  reset: string;
  bold: string;
  dim: string;
  message: string;
  section: string;
  sectionBold: string;
  selected: string;
  selectedBg: string;
  selectedRowText: string;
  unselectedItem: string;
  hintKey: string;
  hintDescription: string;
  hint: string;
  valueYes: string;
  valueNo: string;
  valueOther: string;
  accent: string;
}

export interface CliTheme {
  name: string;
  frameStyle: FrameStyle;
  colors: CliThemeColors;
}

export type BuiltInThemeId =
  | "default"
  | "solarized-dark"
  | "solarized-light"
  | "monokai"
  | "nord"
  | "dracula"
  | "one-dark"
  | "gruvbox-dark"
  | "gruvbox-light"
  | "catppuccin-mocha"
  | "catppuccin-latte"
  | "tokyo-night"
  | "everforest-dark"
  | "everforest-light"
  | "rose-pine"
  | "kanagawa";

export function isBuiltInThemeId(id: string): id is BuiltInThemeId {
  const builtIn: BuiltInThemeId[] = [
    "default",
    "solarized-dark",
    "solarized-light",
    "monokai",
    "nord",
    "dracula",
    "one-dark",
    "gruvbox-dark",
    "gruvbox-light",
    "catppuccin-mocha",
    "catppuccin-latte",
    "tokyo-night",
    "everforest-dark",
    "everforest-light",
    "rose-pine",
    "kanagawa",
  ];
  return builtIn.includes(id as BuiltInThemeId);
}
