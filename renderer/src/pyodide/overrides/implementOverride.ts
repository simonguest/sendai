export const overrides = ["matplotlib", "pygame-ce"]

export const implementOverride = async (pyodide: any, module: string) => {
  //TODO: Need to find some way of linking additional packages to overrides
  switch (module) {
    case "pygame-ce":
      await pyodide.loadPackage("pillow");
      break;
  }
  const response = await fetch(new URL(`./${module}.py`, import.meta.url));
  const code = await response.text();
  await pyodide.runPythonAsync(code);
}