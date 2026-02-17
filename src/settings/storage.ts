import fs from "node:fs";
import path from "node:path";
import type { AppSettings } from "./types.js";
import { DEFAULT_SETTINGS } from "./types.js";
import type { OutputFormat } from "../menus/types.js";
import { getConfigDir } from "../utils/config-dir.js";

const VALID_OUTPUT_FORMATS: OutputFormat[] = ["txt", "md", "json", "html"];

function normalizeDefaultFormats(
  raw: unknown,
  legacySingle: string | undefined
): AppSettings["defaultFormats"] {
  const fromArray = Array.isArray(raw)
    ? (raw as string[]).filter((f): f is OutputFormat =>
        VALID_OUTPUT_FORMATS.includes(f as OutputFormat)
      )
    : [];
  if (fromArray.length > 0) return fromArray;
  if (
    typeof legacySingle === "string" &&
    VALID_OUTPUT_FORMATS.includes(legacySingle as OutputFormat)
  )
    return [legacySingle as OutputFormat];
  return [...DEFAULT_SETTINGS.defaultFormats];
}

function getSettingsPath(): string {
  const configDir = getConfigDir();
  fs.mkdirSync(configDir, { recursive: true });
  return path.join(configDir, "settings.json");
}

export function loadSettings(): AppSettings {
  const settingsPath = getSettingsPath();
  if (!fs.existsSync(settingsPath)) {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const content = fs.readFileSync(settingsPath, "utf-8");
    const parsed = JSON.parse(content) as Partial<AppSettings> & {
      defaultFormat?: AppSettings["defaultFormats"][number];
      htmlUseOriginalStyle?: boolean;
    };
    const result: AppSettings = { ...DEFAULT_SETTINGS, ...parsed };
    if (parsed.htmlUseOriginalStyle !== undefined && !("htmlStyle" in parsed)) {
      result.htmlStyle = parsed.htmlUseOriginalStyle ? "none" : "custom";
    }
    result.defaultFormats = normalizeDefaultFormats(
      result.defaultFormats,
      parsed.defaultFormat
    );
    if (typeof result.cliThemeId !== "string" || !result.cliThemeId.trim()) {
      result.cliThemeId = DEFAULT_SETTINGS.cliThemeId;
    }
    return result;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  const settingsPath = getSettingsPath();
  const payload: AppSettings = {
    ...settings,
    defaultFormats: [...settings.defaultFormats],
  };
  fs.writeFileSync(settingsPath, JSON.stringify(payload, null, 2), "utf-8");
}
