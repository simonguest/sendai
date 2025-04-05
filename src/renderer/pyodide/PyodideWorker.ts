/// <reference lib="webworker" />

import { loadPyodideModule } from "./loadPyodide";
import { additionalPackagesFromCode } from "./additionalPackagesFromCode";

let pyodide: any;
let interruptBuffer: Int32Array | null = null;
const hasSharedArrayBuffer = typeof SharedArrayBuffer !== "undefined";

async function initialize() {
  console.log("PyodideWorker: Starting Pyodide initialization...");
  const { loadPyodide } = await loadPyodideModule();
  pyodide = await loadPyodide();

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

  // Load IPython
  console.log("PyodideWorker: Loading IPython package");
  await pyodide.loadPackage("ipython");

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

  // Override stderr
  console.log("PyodideWorker: Creating override for stderr");
  pyodide.globals.set("_exception", {
    write: (text: string) => {
      console.log(text);
      //self.postMessage({ type: "error", text });
      return text.length;
    },
    flush: () => {
      /* no-op */
    },
  });

  console.log("PyodideWorker: Initializing IPython shell");
  const response = await fetch(new URL("./init_ipython.py", import.meta.url));
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
          // Load required packages
          console.log("PyodideProvider: Loading packages from imports");
          await pyodide.loadPackagesFromImports(code);
          // Load any additional required packages beyond the standard ones that ship with pyodide
          console.log("PyodideProvider: Loading additional packages from code");
          await pyodide.loadPackage(additionalPackagesFromCode(code));
          // Implement any overrides for the currently loaded packages
          console.log("PyodideProvider: Implementing overrides");
          await pyodide.runPythonAsync('implement_overrides()');

          // Run the code in an ipython cell
          console.log("PyodideProvider: Running cell");
          const codeCell = `run_cell("""${code}""", cell_id='${cellId}')`;
          const result = await pyodide.runPythonAsync(codeCell);
          console.log("PyodideProvider: Returning result");
          self.postMessage({ type: "result", result });
        }
      } catch (error) {
        console.error(error);
        self.postMessage({ type: "error", error: String(error) });
      }
      break;
  }
};
