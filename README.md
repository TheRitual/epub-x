# Ebook X – ebook extractor

Interactive Node CLI to extract book text from EPUB files to `.txt` or `.md`. Published to [JSR](https://jsr.io). Version and releases are managed by [semantic-release](https://github.com/semantic-release/semantic-release) on push to `main`.

## Flow

- Main menu: convert an EPUB file or exit
- File browser: navigate directories, go to parent (`..`), select an EPUB (or cancel to menu)
- Choose output format: plain text (`.txt`) or Markdown (`.md`)
- Enter output file name (without extension)
- Extracted file is written to the `output/` directory in the current working directory; progress and final path are shown

## Setup

1. Create a scope and package on [jsr.io/new](https://jsr.io/new). Update `jsr.json` and `package.json` if the scope is not `@ritual`.
2. In the package settings on JSR, link this GitHub repository so CI can publish via OIDC.
3. Use [Conventional Commits](https://www.conventionalcommits.org/) so semantic-release can determine the next version (e.g. `feat:`, `fix:`, `BREAKING CHANGE:`).

## Scripts

- `npm run build` – build CLI to `dist/` (Vite SSR)
- `npm run typecheck` – run `tsc --noEmit`
- `npm run lint` – run ESLint
- `npm run lint:fix` – ESLint with auto-fix
- `npm run format` – Prettier (write)
- `npm run format:check` – Prettier (check)
- `npm test` – run Vitest tests
- `npm run release` – run semantic-release (normally used in CI)

## Install and run

**Global install (use CLI from anywhere):**

```bash
npm install -g .
# or after publishing: npm install -g epub-x
epub-x
```

**Run via JSR (no install):**

```bash
npx jsr run @ritual/epub-x
```

**Local run:**

```bash
npm run build && node dist/cli.js
```
