export async function loadPyodideModule() {
  // @ts-ignore
  return await import(new URL(/* @vite-ignore */`/assets/pyodide.mjs`, import.meta.url));
}