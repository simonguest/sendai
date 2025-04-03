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
    console.log("PyodideWorker: Interrupt buffer created");
  } else {
    console.warn(
      "PyodideWorker: SharedArrayBuffer is not available, interrupt functionality will be disabled"
    );
  }

  // Load IPython
  console.log("PyodideWorker: Loading IPython package");
  await pyodide.loadPackage("ipython");

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
          await pyodide.loadPackagesFromImports(code);
          // Load any additional required packages beyond the standard ones that ship with pyodide
          await pyodide.loadPackage(additionalPackagesFromCode(code));

          // Run the code in an ipython cell
          const codeCell = `result = ipython.run_cell("""${code}""", cell_id='${cellId}')`;
          await pyodide.runPythonAsync(codeCell);

          // Run the result through repr to get the printable representation
          const result = await pyodide.runPythonAsync(`repr(ipython.display_formatter.format(result.result))`);
          console.log(result);
        }
      } catch (error) {
        console.error(error);
        self.postMessage({ type: "error", error: String(error) });
      }
      self.postMessage({ type: "result", result: "" });
      break;
  }
};
