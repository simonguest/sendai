export async function loadPyodideModule() {
  return await import(new URL(/* @vite-ignore */ `/pyodide/pyodide.mjs`, import.meta.url).toString())
}
