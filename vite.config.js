import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Relative base so the build works at any path, including GitHub Pages' /toolbar-season/.
export default defineConfig({
  base: "./",
  plugins: [svelte()],
});
