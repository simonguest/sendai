import type { Plugin } from "vite";

export default function ignorePyodidePlugin(): Plugin {
  return {
    name: "vite-plugin-ignore-pyodide",
    transform(code: string, id: string) {
      if (id.includes("pyodide")) {
        // Add @vite-ignore comment to all dynamic imports in the Pyodide library
        return code.replace(/await import\(/g, "await import(/* @vite-ignore */");
      }
      return code;
    },
  };
}
