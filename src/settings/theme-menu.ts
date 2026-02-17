import type { AppSettings } from "./types.js";
import {
  getBuiltInThemeIds,
  getDefaultTheme,
  DEFAULT_THEMES,
  listCustomThemeIds,
  loadCustomTheme,
  saveCustomTheme,
  deleteCustomTheme,
  isBuiltInThemeId,
} from "../themes/index.js";
import type { BuiltInThemeId } from "../themes/types.js";
import type { CliTheme } from "../themes/types.js";
import { FRAME_STYLES, type FrameStyleId } from "../themes/frame-styles.js";
import {
  COLOR_PALETTE,
  getPaletteCode,
  findPaletteIdByCode,
} from "../themes/palette.js";
import { promptFramedSelect } from "../menus/framed-select.js";
import { input } from "@inquirer/prompts";
import { inquirerTheme } from "../menus/colors.js";

const THEME_MENU_HINT = " ↑/↓ move  Enter select  Esc back";

export type ThemeMenuAction =
  | { type: "back" }
  | { type: "chosen"; cliThemeId: string }
  | { type: "saved"; cliThemeId: string }
  | { type: "deleted" };

function getThemeDisplayName(id: string): string {
  if (isBuiltInThemeId(id)) {
    return DEFAULT_THEMES[id as BuiltInThemeId].name + " (built-in)";
  }
  const custom = loadCustomTheme(id);
  return custom ? `${custom.name} (custom)` : id;
}

export async function promptThemeMenu(
  settings: AppSettings
): Promise<ThemeMenuAction> {
  const choices = [
    { name: "Choose theme", value: "choose" },
    { name: "Edit theme", value: "edit" },
    { name: "Add theme (copy from existing)", value: "add" },
    ...(isBuiltInThemeId(settings.cliThemeId)
      ? []
      : [{ name: "Delete current theme", value: "delete" }]),
    { name: "Back", value: "back" },
  ].filter((c): c is { name: string; value: string } => "value" in c);

  const value = await promptFramedSelect(
    "Theme",
    choices as { name: string; value: string }[],
    THEME_MENU_HINT
  );

  if (value === null || value === "back") return { type: "back" };
  if (value === "choose") {
    const id = await promptChooseTheme(settings.cliThemeId);
    if (id !== null) return { type: "chosen", cliThemeId: id };
    return { type: "back" };
  }
  if (value === "edit") {
    const result = await runEditTheme(settings.cliThemeId);
    if (result) return result;
    return { type: "back" };
  }
  if (value === "add") {
    const id = await promptAddTheme();
    if (id !== null) return { type: "chosen", cliThemeId: id };
    return { type: "back" };
  }
  if (value === "delete") {
    const ok = await promptConfirmDelete();
    if (ok) {
      deleteCustomTheme(settings.cliThemeId);
      return { type: "deleted" };
    }
    return { type: "back" };
  }
  return { type: "back" };
}

async function promptChooseTheme(currentId: string): Promise<string | null> {
  const builtIn = getBuiltInThemeIds();
  const custom = listCustomThemeIds();
  const choices = [
    ...builtIn.map((id) => ({
      name: getThemeDisplayName(id),
      value: id,
    })),
    ...custom.map((id) => ({
      name: getThemeDisplayName(id),
      value: id,
    })),
  ];
  const value = await promptFramedSelect(
    "Choose theme",
    choices,
    THEME_MENU_HINT,
    choices.findIndex((c) => c.value === currentId)
  );
  return value;
}

async function promptAddTheme(): Promise<string | null> {
  const builtIn = getBuiltInThemeIds();
  const custom = listCustomThemeIds();
  const choices = [
    ...builtIn.map((id) => ({ name: getThemeDisplayName(id), value: id })),
    ...custom.map((id) => ({ name: getThemeDisplayName(id), value: id })),
  ];
  const baseValue = await promptFramedSelect(
    "Base theme for new theme",
    choices,
    THEME_MENU_HINT
  );
  if (baseValue === null) return null;
  const baseTheme = isBuiltInThemeId(baseValue)
    ? getDefaultTheme(baseValue as BuiltInThemeId)
    : loadCustomTheme(baseValue);
  if (!baseTheme) return null;
  const name = await input({
    message: "New theme name (used as filename for custom theme)",
    default: baseTheme.name + " (copy)",
    theme: inquirerTheme,
    validate: (v) => {
      const t = v.trim();
      if (!t) return "Name cannot be empty.";
      if (/[<>:"/\\|?*]/.test(t)) return 'Name must not contain <>:"/\\|?*';
      return true;
    },
  });
  const id = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
  if (!id) return null;
  const newTheme: CliTheme = {
    name: name.trim(),
    frameStyle: { ...baseTheme.frameStyle },
    colors: { ...baseTheme.colors },
  };
  saveCustomTheme(id, newTheme);
  return id;
}

async function promptConfirmDelete(): Promise<boolean> {
  const value = await promptFramedSelect(
    "Delete this theme?",
    [
      { name: "No, keep it", value: "no" },
      { name: "Yes, delete", value: "yes" },
    ],
    THEME_MENU_HINT,
    0
  );
  return value === "yes";
}

type EditResult =
  | { type: "chosen"; cliThemeId: string }
  | { type: "saved"; cliThemeId: string }
  | null;

async function runEditTheme(currentId: string): Promise<EditResult | null> {
  const isBuiltIn = isBuiltInThemeId(currentId);
  const theme: CliTheme = isBuiltIn
    ? getDefaultTheme(currentId as BuiltInThemeId)
    : (loadCustomTheme(currentId) ?? getDefaultTheme("default"));

  const edited = await runThemeEditor(theme);
  if (!edited) return null;

  if (isBuiltIn) {
    const newId = await promptNewThemeId(edited.name);
    if (newId === null) return null;
    saveCustomTheme(newId, edited);
    return { type: "chosen", cliThemeId: newId };
  }

  const action = await promptSaveOrSaveAs();
  if (action === "cancel") return null;
  if (action === "save") {
    saveCustomTheme(currentId, edited);
    return { type: "saved", cliThemeId: currentId };
  }
  const newId = await promptNewThemeId(edited.name);
  if (newId === null) return null;
  saveCustomTheme(newId, edited);
  return { type: "chosen", cliThemeId: newId };
}

async function promptSaveOrSaveAs(): Promise<"save" | "saveAs" | "cancel"> {
  const value = await promptFramedSelect(
    "Save theme",
    [
      { name: "Save (overwrite current)", value: "save" },
      { name: "Save as (new copy)", value: "saveAs" },
      { name: "Cancel", value: "cancel" },
    ],
    THEME_MENU_HINT,
    0
  );
  return (value as "save" | "saveAs" | "cancel") ?? "cancel";
}

async function promptNewThemeId(defaultName: string): Promise<string | null> {
  const name = await input({
    message: "Custom theme id (filename, e.g. my-theme)",
    default: defaultName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, ""),
    theme: inquirerTheme,
    validate: (v) => {
      const t = v.trim();
      if (!t) return "Id cannot be empty.";
      if (/[<>:"/\\|?*]/.test(t)) return 'Id must not contain <>:"/\\|?*';
      return true;
    },
  });
  const id = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
  return id || null;
}

const FRAME_IDS: FrameStyleId[] = [
  "single",
  "double",
  "rounded",
  "minimal",
  "thick",
  "heavy",
];

const COLOR_SLOTS: (keyof CliTheme["colors"])[] = [
  "message",
  "section",
  "sectionBold",
  "selected",
  "selectedBg",
  "selectedRowText",
  "unselectedItem",
  "hintKey",
  "hintDescription",
  "hint",
  "valueYes",
  "valueNo",
  "valueOther",
  "accent",
];

const COLOR_LABELS: Record<keyof CliTheme["colors"], string> = {
  reset: "Reset",
  bold: "Bold",
  dim: "Dim",
  message: "Message / title",
  section: "Section",
  sectionBold: "Section bold",
  selected: "Selected item",
  selectedBg: "Selected row background",
  selectedRowText: "Selected row text",
  unselectedItem: "Unselected item",
  hintKey: "Hint key",
  hintDescription: "Hint description",
  hint: "Hint / description",
  valueYes: "Value Yes",
  valueNo: "Value No",
  valueOther: "Value other",
  accent: "Accent",
};

async function runThemeEditor(theme: CliTheme): Promise<CliTheme | null> {
  const edited: CliTheme = {
    name: theme.name,
    frameStyle: { ...theme.frameStyle },
    colors: { ...theme.colors },
  };

  for (;;) {
    const frameLabel =
      FRAME_IDS.find(
        (id) =>
          FRAME_STYLES[id]?.topLeft === edited.frameStyle.topLeft &&
          FRAME_STYLES[id]?.horizontal === edited.frameStyle.horizontal
      ) ?? "single";
    const choices = [
      {
        name: `Frame style: ${frameLabel}`,
        value: "frame",
      },
      ...COLOR_SLOTS.map((key) => {
        const pid = findPaletteIdByCode(edited.colors[key]);
        const pal = COLOR_PALETTE.find((p) => p.id === pid);
        return {
          name: `${COLOR_LABELS[key]}: ${pal?.label ?? "Custom"}`,
          value: key,
        };
      }),
      { name: "Done", value: "done" },
      { name: "Cancel", value: "cancel" },
    ];

    const value = await promptFramedSelect(
      "Edit theme: " + edited.name,
      choices,
      THEME_MENU_HINT
    );

    if (value === null || value === "cancel") return null;
    if (value === "done") return edited;
    if (value === "frame") {
      const frameId = await promptFramedSelect(
        "Frame style",
        FRAME_IDS.map((id) => ({ name: id, value: id })),
        THEME_MENU_HINT
      );
      if (
        frameId !== null &&
        (FRAME_IDS as readonly string[]).includes(frameId) &&
        FRAME_STYLES[frameId as FrameStyleId]
      ) {
        edited.frameStyle = { ...FRAME_STYLES[frameId as FrameStyleId] };
      }
      continue;
    }
    if (COLOR_SLOTS.includes(value as keyof CliTheme["colors"])) {
      const key = value as keyof CliTheme["colors"];
      const paletteChoices = COLOR_PALETTE.map((p) => ({
        name: p.label,
        value: p.id,
      }));
      const currentCode = edited.colors[key];
      const currentId = findPaletteIdByCode(currentCode);
      const idx = paletteChoices.findIndex((c) => c.value === currentId);
      const picked = await promptFramedSelect(
        COLOR_LABELS[key],
        paletteChoices,
        THEME_MENU_HINT,
        idx < 0 ? 0 : idx
      );
      if (picked !== null) {
        edited.colors[key] = getPaletteCode(picked);
      }
    }
  }
}
