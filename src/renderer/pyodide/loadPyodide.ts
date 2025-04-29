export async function loadPyodideModule() {
  // @ts-ignore
  // @vite-ignore
  return await import("/assets/pyodide/pyodide.mjs");
}