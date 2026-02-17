import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: "src/cli.ts",
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "src/cli.ts",
      output: {
        entryFileNames: "cli.js",
        format: "es",
      },
    },
    minify: false,
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
