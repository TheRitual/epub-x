# Ebook X – ebook extractor

Node CLI published to [JSR](https://jsr.io). Version and releases are managed by [semantic-release](https://github.com/semantic-release/semantic-release) on push to `main`.

## Setup

1. Create a scope and package on [jsr.io/new](https://jsr.io/new). Update `jsr.json` and `package.json` if the scope is not `@ritual`.
2. In the package settings on JSR, link this GitHub repository so CI can publish via OIDC.
3. Use [Conventional Commits](https://www.conventionalcommits.org/) so semantic-release can determine the next version (e.g. `feat:`, `fix:`, `BREAKING CHANGE:`).

## Scripts

- `npm run build` – compile TypeScript to `dist/`
- `npm run typecheck` – run `tsc --noEmit`
- `npm run lint` – run ESLint
- `npm run release` – run semantic-release (normally used in CI)

## Run via JSR

```bash
npx jsr run @ritual/epub-x
```