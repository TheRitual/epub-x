export interface PaletteColor {
  id: string;
  label: string;
  code: string;
}

export const COLOR_PALETTE: PaletteColor[] = [
  { id: "reset", label: "Default", code: "\x1b[0m" },
  { id: "black", label: "Black", code: "\x1b[30m" },
  { id: "red", label: "Red", code: "\x1b[31m" },
  { id: "green", label: "Green", code: "\x1b[32m" },
  { id: "yellow", label: "Yellow", code: "\x1b[33m" },
  { id: "blue", label: "Blue", code: "\x1b[34m" },
  { id: "magenta", label: "Magenta", code: "\x1b[35m" },
  { id: "cyan", label: "Cyan", code: "\x1b[36m" },
  { id: "white", label: "White", code: "\x1b[37m" },
  { id: "brightBlack", label: "Bright black", code: "\x1b[90m" },
  { id: "brightRed", label: "Bright red", code: "\x1b[91m" },
  { id: "brightGreen", label: "Bright green", code: "\x1b[92m" },
  { id: "brightYellow", label: "Bright yellow", code: "\x1b[93m" },
  { id: "brightBlue", label: "Bright blue", code: "\x1b[94m" },
  { id: "brightMagenta", label: "Bright magenta", code: "\x1b[95m" },
  { id: "brightCyan", label: "Bright cyan", code: "\x1b[96m" },
  { id: "brightWhite", label: "Bright white", code: "\x1b[97m" },
  { id: "dim", label: "Dim", code: "\x1b[2m" },
  { id: "bold", label: "Bold", code: "\x1b[1m" },
  { id: "orange", label: "Orange (256)", code: "\x1b[38;5;208m" },
  { id: "purple256", label: "Purple (256)", code: "\x1b[38;5;99m" },
  { id: "pink256", label: "Pink (256)", code: "\x1b[38;5;212m" },
  { id: "teal256", label: "Teal (256)", code: "\x1b[38;5;109m" },
  { id: "bgMagenta", label: "Bg magenta", code: "\x1b[45m" },
  { id: "bgBlue", label: "Bg blue", code: "\x1b[44m" },
  { id: "bgCyan", label: "Bg cyan", code: "\x1b[46m" },
  { id: "bg256", label: "Bg dark (256)", code: "\x1b[48;5;53m" },
  { id: "blueBold", label: "Blue bold", code: "\x1b[34m\x1b[1m" },
  {
    id: "brightWhiteBold",
    label: "Bright white bold",
    code: "\x1b[97m\x1b[1m",
  },
  { id: "dimCyan", label: "Dim cyan", code: "\x1b[2m\x1b[36m" },
];

export function getPaletteCode(id: string): string {
  const found = COLOR_PALETTE.find((c) => c.id === id);
  return found?.code ?? "\x1b[0m";
}

export function findPaletteIdByCode(code: string): string {
  const found = COLOR_PALETTE.find((c) => c.code === code);
  return found?.id ?? "reset";
}
