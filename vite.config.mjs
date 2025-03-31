import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

import ignorePyodidePlugin from "./vite-plugin-ignore-pyodide";

export default defineConfig({
  plugins: [vue(), ignorePyodidePlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@renderer": resolve(__dirname, "./src/renderer"),
    },
  },
  worker: {
    format: 'es'
  },
});