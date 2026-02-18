import type { OutputFormat } from "../../menus/types.js";
import type { AppSettings } from "../../settings/types.js";

type FormatWithImages = "md" | "html" | "json" | "webapp";

function isFormatWithImages(f: OutputFormat): f is FormatWithImages {
  return f === "md" || f === "html" || f === "json" || f === "webapp";
}

export function getDefaultIncludeImages(
  settings: AppSettings,
  formats: OutputFormat[]
): boolean {
  for (const fmt of formats) {
    if (isFormatWithImages(fmt) && settings.formats[fmt].includeImages) {
      return true;
    }
  }
  return false;
}
