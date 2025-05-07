const getURL = () => {
  // @ts-ignore
  if (import.meta.env.DEV){
    return new URL(/* @vite-ignore */`/assets/pyodide.mjs`, import.meta.url)
  } else {
    return new URL(new URL(/* @vite-ignore */`./pyodide.mjs`, import.meta.url));
  }
}

export async function loadPyodideModule() {
  return await import(getURL().toString());
}