import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

import ignorePyodidePlugin from "./vite-plugin-ignore-pyodide";

export default defineConfig({
  plugins: [
    vue(),
    ignorePyodidePlugin(),
    viteStaticCopy({
      targets: [
        {
          src: "assets/**",
          dest: "assets",
        },
      ],
    }),
  ],
  publicDir: false,
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@renderer": resolve(__dirname, "./src/renderer"),
    },
  },
  worker: {
    format: "es",
  },
  server: {
    port: 55000,
    host: "0.0.0.0",
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
  },
  preview: {
    port: 55000,
    host: "0.0.0.0",
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
  },
});
