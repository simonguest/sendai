export async function loadPyodideModule() {
  // @ts-ignore
  return await import(/* @vite-ignore */`${location.origin}/assets/pyodide.mjs`);
}