/// <reference lib="webworker" />

import { additionalPackagesFromCode } from "./additionalPackagesFromCode";
import { overrides, implementOverride } from "./overrides/implementOverride";

let pyodide: any;
let interruptBuffer: Int32Array | null = null;
const hasSharedArrayBuffer = typeof SharedArrayBuffer !== "undefined";

async function initialize() {
  console.log("PyodideWorker: Starting Pyodide initialization...");

  // @ts-ignore
  if (import.meta.env.DEV) {
    // Local dev server
    const { loadPyodide } = await import(new URL(/* @vite-ignore */"/pyodide/pyodide.mjs", import.meta.url).toString());
    pyodide = await loadPyodide();
  } else {
    // Production
    const { loadPyodide } = await import(new URL(/* @vite-ignore */"../pyodide/pyodide.mjs", import.meta.url).toString());
    pyodide = await loadPyodide();
  }

  console.log("PyodideWorker: Checking for interrupt buffer");
  if (hasSharedArrayBuffer) {
    const buffer = new SharedArrayBuffer(4);
    interruptBuffer = new Int32Array(buffer);
    pyodide.setInterruptBuffer(interruptBuffer);
    console.log("PyodideWorker: Interrupt buffer created");
  } else {
    console.warn(
      "PyodideWorker: SharedArrayBuffer is not available, interrupt functionality will be disabled"
    );
  }

  // Override stdout
  console.log("PyodideWorker: Creating override for stdout");
  pyodide.globals.set("_override_stdout", {
    write: (text: string) => {
      self.postMessage({ type: "stdout", text });
      return text.length;
    },
    flush: () => {
      /* no-op */
    },
  });

  // Override base64 image updates
  console.log("PyodideWorker: Creating override for js functions");
  pyodide.globals.set("js", {
    imageBase64: (image_base64: string) => {
      self.postMessage({ type: "execute_result", result: { "image/png": [image_base64] } });
    },
  });

  console.log("PyodideWorker: Initializing Python environment");
  const response = await fetch(new URL("./python_init.py", import.meta.url));
  const code = await response.text();
  await pyodide.runPythonAsync(code);
}

self.onmessage = async event => {
  const { type, ...data } = event.data;

  switch (type) {
    case "initialize":
      try {
        await initialize();
        self.postMessage({
          type: "initialized",
          interruptBuffer: interruptBuffer ? interruptBuffer.buffer : null,
          hasInterrupt: hasSharedArrayBuffer,
        });
      } catch (error) {
        console.error("PyodideWorker: Failed to initialize Pyodide:", error);
        self.postMessage({ type: "fatal", error: String(error) });
      }
      break;
    case "run":
      const code = data.code;
      const cellId = data.cellId;
      try {
        if (pyodide) {
          console.log("PyodideProvider: Loading packages from imports");
          const basePackages = await pyodide.loadPackagesFromImports(code)
          console.log("PyodideProvider: Loading additional packages from code");
          const additionalPackages = await pyodide.loadPackage(additionalPackagesFromCode(code));
          
          console.log("PyodideProvider: Searching for overrides");
          for(const loadedPackage of [...basePackages, ...additionalPackages]){
            if (overrides.indexOf(loadedPackage.name) !== -1){
              console.log(`PyodideProvider: Implementing override for ${loadedPackage.name}`);
              await implementOverride(pyodide, loadedPackage.name)
            }
          }

          // Run the cell code
          console.log(`PyodideProvider: Running cell ${cellId}`);
          const result = await pyodide.runPythonAsync(`${code}`);
          console.log("PyodideProvider: Returning result");
          if (result) {
            if (typeof result == "object") {
              // Add result representations, if they exist
              if ("_repr_svg_" in result){
                self.postMessage({ type: "execute_result", result: { "image/svg+xml": result._repr_svg_() }});
              }
              if ("_repr_html_" in result){
                self.postMessage({ type: "execute_result", result: { "text/html": result._repr_html_() }});
              }
              if ("_repr_png_" in result){
                self.postMessage({ type: "execute_result", result: { "image/png": result._repr_png_() }});
              }
              // Add the default result representation
              self.postMessage({ type: "execute_result", result: { "text/plain": result.__repr__() }});
            } else {
              // The result is not an object. Just pass the result back as a string.
              self.postMessage({ type: "execute_result", result: { "text/plain": result.toString() } });
            }
          }
          self.postMessage({ type: "execute_completed" });
        }
      } catch (error) {
        console.error(error);
        self.postMessage({ type: "error", error: String(error) });
      }
      break;
  }
};
