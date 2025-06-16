import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  publicDir: true,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        emulator: resolve(__dirname, 'emulator.html')
      },
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
    "@renderer": resolve(__dirname, "../../renderer/src"),
    "@shared": resolve(__dirname, "../../shared")
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
