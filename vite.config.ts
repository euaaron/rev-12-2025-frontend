import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // For GitHub Pages deployments, set `VITE_BASE` in CI to `/<repo>/`.
  // Locally (or other hosts), it defaults to `/`.
  base: process.env.VITE_BASE ?? "/",
  plugins: [react()],
});
