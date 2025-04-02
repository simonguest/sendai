/// <reference lib="webworker" />

import { loadPyodideModule } from "./loadPyodide";

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
      console.log(data);
      try {
        if (pyodide) {
          await pyodide.runPythonAsync("std_capture.start()");
          await pyodide.runPythonAsync(`run_cell('${code}', cell_id='${cellId}')`);
          const output = await pyodide.runPythonAsync("std_capture.get_output()");
          console.log(output[0]);
          console.log(output[1]);
        }
      } catch (error) {
        console.error("PyodideWorker: " + error);
        self.postMessage({ type: "error", error: String(error) });
      }
      break;
  }
};
