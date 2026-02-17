import { select } from "@inquirer/prompts";
import path from "node:path";
import { listEntries } from "./utils.js";
import type { FileExplorerEntry } from "./types.js";

const CANCEL_VALUE = "__cancel__";

export async function promptSelectEpubFile(
  startDir: string
): Promise<string | null> {
  let currentDir = path.resolve(startDir);

  for (;;) {
    const entries = listEntries(currentDir);
    const choices = [
      {
        name: "Cancel (back to menu)",
        value: CANCEL_VALUE,
        description: "Return to main menu",
      },
      ...entries.map((e) => ({
        name: e.name,
        value: e.path,
        description:
          e.type === "parent"
            ? "Go to parent directory"
            : e.type === "directory"
              ? "Open directory"
              : "Select EPUB",
      })),
    ];

    if (entries.length === 0) {
      choices.push({
        name: "Back",
        value: "back",
        description: "Go to parent directory",
      });
    }

    const choice = await select({
      message: `Select file or directory (in ${currentDir})`,
      choices,
    });

    if (choice === CANCEL_VALUE) return null;
    if (choice === "back") {
      const parent = path.dirname(currentDir);
      if (parent === currentDir) return null;
      currentDir = parent;
      continue;
    }

    const selected = entries.find((e) => e.path === choice) as
      | FileExplorerEntry
      | undefined;
    if (!selected) continue;

    if (selected.type === "epub") return selected.path;
    if (selected.type === "parent" || selected.type === "directory") {
      currentDir = selected.path;
    }
  }
}
