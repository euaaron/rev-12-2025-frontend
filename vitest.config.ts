import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "json-summary"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts",
        "src/vite-env.d.ts",
        "src/main.tsx",
        "src/mocks/**",
        "src/types/**",
        "src/**/__tests__/**",
        "src/**/__mocks__/**",
        "src/**/*.test.{ts,tsx}",
        "tests/**",
        "dist/**",
        "public/**",
        "node_modules/**",
        ".vscode/**",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});

