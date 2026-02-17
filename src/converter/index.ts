import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import EPub from "epub2";
import type { ConvertFormat, ConvertResult } from "./types.js";
import { htmlToMarkdown, htmlToPlainText } from "./utils.js";

const DEFAULT_OUTPUT_DIR = "output";

function getOutputDir(): string {
  return path.join(process.cwd(), DEFAULT_OUTPUT_DIR);
}

export async function convertEpub(
  epubPath: string,
  outputBasename: string,
  format: ConvertFormat
): Promise<ConvertResult> {
  const epub = await EPub.createAsync(epubPath);
  const flow = epub.flow;
  const total = flow.length;
  const parts: string[] = [];

  for (let i = 0; i < flow.length; i++) {
    const chapter = flow[i];
    const id = chapter?.id;
    if (!id) continue;
    const raw = await epub.getChapterRawAsync(id);
    const content =
      format === "md" ? htmlToMarkdown(raw) : htmlToPlainText(raw);
    parts.push(content);
    process.stdout.write(`\rConverting chapter ${i + 1}/${total}...`);
  }
  process.stdout.write("\n");

  const ext = format === "md" ? ".md" : ".txt";
  const outDir = getOutputDir();
  fs.mkdirSync(outDir, { recursive: true });
  const outputPath = path.join(outDir, outputBasename + ext);
  fs.writeFileSync(outputPath, parts.join("\n\n"), "utf-8");

  return { outputPath, totalChapters: total };
}

export function resolveOutputDir(): string {
  const dir = getOutputDir();
  fs.mkdirSync(dir, { recursive: true });
  return path.resolve(dir);
}
