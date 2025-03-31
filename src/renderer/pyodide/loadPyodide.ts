export async function loadPyodideModule() {
  // @ts-ignore
  // @vite-ignore
  return await import("/public/pyodide/pyodide.mjs");
}