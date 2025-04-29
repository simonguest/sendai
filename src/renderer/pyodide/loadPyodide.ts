export async function loadPyodideModule() {
  // @ts-ignore
  // @vite-ignore
  return await import("/pyodide/pyodide.mjs");
}