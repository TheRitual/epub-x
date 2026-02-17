import { select, input } from "@inquirer/prompts";
import type { MainMenuAction, OutputFormat } from "./types.js";

export async function promptMainMenu(): Promise<MainMenuAction> {
  const action = await select<MainMenuAction>({
    message: "What do you want to do?",
    choices: [
      { name: "Convert an EPUB file", value: "convert" },
      { name: "Exit", value: "exit" },
    ],
  });
  return action;
}

export async function promptOutputFormat(): Promise<OutputFormat> {
  const format = await select<OutputFormat>({
    message: "Output format",
    choices: [
      { name: "Plain text (.txt)", value: "txt" },
      { name: "Markdown (.md)", value: "md" },
    ],
  });
  return format;
}

export async function promptOutputFilename(): Promise<string> {
  const name = await input({
    message: "Output file name (without extension)",
    validate: (value) => {
      const trimmed = value.trim();
      if (trimmed.length === 0) return "Please enter a non-empty name.";
      if (/[<>:"/\\|?*]/.test(trimmed))
        return 'Name must not contain <>:"/\\|?*';
      return true;
    },
  });
  return name.trim();
}
