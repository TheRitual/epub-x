import { getCurrentTheme } from "../themes/context.js";

export function getThemeColors(): ReturnType<typeof getCurrentTheme>["colors"] {
  return getCurrentTheme().colors;
}

function themeGetter<
  K extends keyof ReturnType<typeof getCurrentTheme>["colors"],
>(key: K): ReturnType<typeof getCurrentTheme>["colors"][K] {
  return getCurrentTheme().colors[key];
}

export const theme = {
  get reset() {
    return themeGetter("reset");
  },
  get bold() {
    return themeGetter("bold");
  },
  get dim() {
    return themeGetter("dim");
  },
  get message() {
    return themeGetter("message");
  },
  get section() {
    return themeGetter("section");
  },
  get sectionBold() {
    return themeGetter("sectionBold");
  },
  get selected() {
    return themeGetter("selected");
  },
  get selectedBg() {
    return themeGetter("selectedBg");
  },
  get selectedRowText() {
    return themeGetter("selectedRowText");
  },
  get unselectedItem() {
    return themeGetter("unselectedItem");
  },
  get hintKey() {
    return themeGetter("hintKey");
  },
  get hintDescription() {
    return themeGetter("hintDescription");
  },
  get hint() {
    return themeGetter("hint");
  },
  get valueYes() {
    return themeGetter("valueYes");
  },
  get valueNo() {
    return themeGetter("valueNo");
  },
  get valueOther() {
    return themeGetter("valueOther");
  },
  get accent() {
    return themeGetter("accent");
  },
};

export function styleMessage(text: string): string {
  const t = getCurrentTheme().colors;
  return t.message + text + t.reset;
}

export function styleSection(text: string): string {
  const t = getCurrentTheme().colors;
  return t.section + text + t.reset;
}

export function styleSelected(text: string): string {
  const t = getCurrentTheme().colors;
  return t.selected + text + t.reset;
}

export function styleHint(text: string): string {
  const t = getCurrentTheme().colors;
  return t.dim + t.hint + text + t.reset;
}

export function styleSelectedRow(text: string): string {
  const t = getCurrentTheme().colors;
  return t.selectedBg + t.selectedRowText + text + t.reset;
}

export function styleHintTips(text: string): string {
  const t = getCurrentTheme().colors;
  const withoutPipe = text.replace(/\|/g, "").trim();
  const segments = withoutPipe.split(/\s{2,}/);
  const parts = segments.map((seg) => {
    const spaceIdx = seg.indexOf(" ");
    const key = spaceIdx === -1 ? seg : seg.slice(0, spaceIdx);
    const desc = spaceIdx === -1 ? "" : seg.slice(spaceIdx + 1);
    const keyStyled = t.hintKey + key + t.reset;
    const descStyled =
      desc === "" ? "" : t.hintDescription + " " + desc + t.reset;
    return keyStyled + descStyled;
  });
  return parts.join(t.hintDescription + "  " + t.reset);
}

export function styleSettingValue(value: string): string {
  const t = getCurrentTheme().colors;
  const color =
    value === "Yes" ? t.valueYes : value === "No" ? t.valueNo : t.valueOther;
  return color + t.bold + value + t.reset;
}

export function styleSettingLabel(name: string): string {
  const idx = name.lastIndexOf(": ");
  if (idx === -1) return name;
  const prefix = name.slice(0, idx + 2);
  const value = name.slice(idx + 2);
  return prefix + styleSettingValue(value);
}

export function styleSectionBold(text: string): string {
  const t = getCurrentTheme().colors;
  return t.sectionBold + text + t.reset;
}

const BOLD_WHITE = "\x1b[1;37m";
const RESET = "\x1b[0m";

export function styleDone(text: string): string {
  return BOLD_WHITE + text + RESET;
}

export function getInquirerTheme(): {
  prefix: string;
  style: {
    message: (text: string) => string;
    help: (text: string) => string;
    highlight: (text: string) => string;
    key: (text: string) => string;
    answer: (text: string) => string;
  };
} {
  const t = getCurrentTheme().colors;
  return {
    prefix: t.accent + "?" + t.reset + " ",
    style: {
      message: (text: string): string => t.accent + t.bold + text + t.reset,
      help: (text: string): string => t.dim + t.hint + text + t.reset,
      highlight: (text: string): string => t.selected + text + t.reset,
      key: (text: string): string =>
        t.hint + t.bold + "<" + text + ">" + t.reset,
      answer: (text: string): string => t.section + text + t.reset,
    },
  };
}

export const inquirerTheme = {
  get prefix(): string {
    return getInquirerTheme().prefix;
  },
  get style(): ReturnType<typeof getInquirerTheme>["style"] {
    return getInquirerTheme().style;
  },
};
