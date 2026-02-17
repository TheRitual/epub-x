import fs from "node:fs";
import path from "node:path";
import { getThemesDir } from "../utils/config-dir.js";
import type { CliTheme, FrameStyle } from "./types.js";
import type { CliThemeColors } from "./types.js";

const THEME_EXT = ".json";

function themePath(id: string): string {
  const dir = getThemesDir();
  fs.mkdirSync(dir, { recursive: true });
  const safe = path.basename(id).replace(/\.json$/i, "");
  return path.join(dir, safe + THEME_EXT);
}

function parseFrameStyle(o: Record<string, unknown>): FrameStyle | null {
  const topLeft = o.topLeft;
  const topRight = o.topRight;
  const bottomLeft = o.bottomLeft;
  const bottomRight = o.bottomRight;
  const horizontal = o.horizontal;
  const vertical = o.vertical;
  const dividerLeft = o.dividerLeft;
  const dividerCross = o.dividerCross;
  const dividerRight = o.dividerRight;
  if (
    typeof topLeft !== "string" ||
    typeof topRight !== "string" ||
    typeof bottomLeft !== "string" ||
    typeof bottomRight !== "string" ||
    typeof horizontal !== "string" ||
    typeof vertical !== "string" ||
    typeof dividerLeft !== "string" ||
    typeof dividerCross !== "string" ||
    typeof dividerRight !== "string"
  )
    return null;
  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    horizontal,
    vertical,
    dividerLeft,
    dividerCross,
    dividerRight,
  };
}

function parseColors(o: Record<string, unknown>): CliThemeColors | null {
  const reset = o.reset;
  const bold = o.bold;
  const dim = o.dim;
  const message = o.message;
  const section = o.section;
  const sectionBold = o.sectionBold;
  const selected = o.selected;
  const selectedBg = o.selectedBg;
  const selectedRowText = o.selectedRowText;
  const unselectedItem = o.unselectedItem;
  const hintKey = o.hintKey;
  const hintDescription = o.hintDescription;
  const hint = o.hint;
  const valueYes = o.valueYes;
  const valueNo = o.valueNo;
  const valueOther = o.valueOther;
  const accent = o.accent;
  if (
    typeof reset !== "string" ||
    typeof bold !== "string" ||
    typeof dim !== "string" ||
    typeof message !== "string" ||
    typeof section !== "string" ||
    typeof sectionBold !== "string" ||
    typeof selected !== "string" ||
    typeof selectedBg !== "string" ||
    typeof selectedRowText !== "string" ||
    typeof unselectedItem !== "string" ||
    typeof hintKey !== "string" ||
    typeof hintDescription !== "string" ||
    typeof hint !== "string" ||
    typeof valueYes !== "string" ||
    typeof valueNo !== "string" ||
    typeof valueOther !== "string" ||
    typeof accent !== "string"
  )
    return null;
  return {
    reset,
    bold,
    dim,
    message,
    section,
    sectionBold,
    selected,
    selectedBg,
    selectedRowText,
    unselectedItem,
    hintKey,
    hintDescription,
    hint,
    valueYes,
    valueNo,
    valueOther,
    accent,
  };
}

function parseThemeFile(content: string): CliTheme | null {
  try {
    const data = JSON.parse(content) as Record<string, unknown>;
    if (typeof data.name !== "string") return null;
    if (!data.frameStyle || typeof data.frameStyle !== "object") return null;
    if (!data.colors || typeof data.colors !== "object") return null;
    const frameStyle = parseFrameStyle(
      data.frameStyle as Record<string, unknown>
    );
    const colors = parseColors(data.colors as Record<string, unknown>);
    if (!frameStyle || !colors) return null;
    return { name: data.name, frameStyle, colors };
  } catch {
    return null;
  }
}

export function listCustomThemeIds(): string[] {
  const dir = getThemesDir();
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  return files
    .filter((f) => f.endsWith(THEME_EXT))
    .map((f) => path.basename(f, THEME_EXT));
}

export function loadCustomTheme(id: string): CliTheme | null {
  const filePath = themePath(id);
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return parseThemeFile(content);
  } catch {
    return null;
  }
}

export function saveCustomTheme(id: string, theme: CliTheme): void {
  const filePath = themePath(id);
  const payload = {
    name: theme.name,
    frameStyle: theme.frameStyle,
    colors: theme.colors,
  };
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
}

export function deleteCustomTheme(id: string): boolean {
  const filePath = themePath(id);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

export function customThemeExists(id: string): boolean {
  return fs.existsSync(themePath(id));
}
