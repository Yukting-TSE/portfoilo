import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages project site: /portfoilo/
const base =
  process.env.GITHUB_PAGES === "true" ? "/portfoilo/" : "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: true,
    watch: {
      ignored: ["**/node_modules/**", "**/*.mp4"],
    },
  },
  preview: {
    host: true,
    port: 4173,
  },
});
