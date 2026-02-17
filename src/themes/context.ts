import type { CliTheme } from "./types.js";
import { isBuiltInThemeId } from "./types.js";
import { getDefaultTheme } from "./default-themes.js";
import { loadCustomTheme } from "./storage.js";

let currentTheme: CliTheme | null = null;

export function setCurrentTheme(theme: CliTheme): void {
  currentTheme = theme;
}

export function getCurrentTheme(): CliTheme {
  if (!currentTheme) {
    const fallback = getDefaultTheme("default");
    currentTheme = fallback;
    return fallback;
  }
  return currentTheme;
}

export function resolveTheme(cliThemeId: string): CliTheme {
  if (isBuiltInThemeId(cliThemeId)) {
    return getDefaultTheme(cliThemeId);
  }
  const custom = loadCustomTheme(cliThemeId);
  if (custom) return custom;
  return getDefaultTheme("default");
}
