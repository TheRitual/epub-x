import fs from "node:fs";
import path from "node:path";
import type { FileExplorerEntry } from "./types.js";

const EPUB_EXT = ".epub";

export function listEntries(dir: string): FileExplorerEntry[] {
  const resolved = path.resolve(dir);
  const entries: FileExplorerEntry[] = [];
  const names = fs.readdirSync(resolved, { withFileTypes: true });

  const parentDir = path.dirname(resolved);
  if (parentDir !== resolved) {
    entries.push({
      type: "parent",
      name: "..",
      path: parentDir,
    });
  }

  const dirs = names
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => ({
      type: "directory" as const,
      name: d.name + "/",
      path: path.join(resolved, d.name),
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  const epubs = names
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(EPUB_EXT))
    .map((d) => ({
      type: "epub" as const,
      name: d.name,
      path: path.join(resolved, d.name),
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  return [...entries, ...dirs, ...epubs];
}

export function isEpubPath(filePath: string): boolean {
  return filePath.toLowerCase().endsWith(EPUB_EXT);
}
