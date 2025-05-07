export async function loadPyodideModule() {
  return await import(
    // @ts-ignore
    import.meta.env.DEV
      ? new URL(/* @vite-ignore */ `/assets/pyodide.mjs`, import.meta.url).toString()
      : new URL(/* @vite-ignore */ `./pyodide.mjs`, import.meta.url).toString()
  );
}
