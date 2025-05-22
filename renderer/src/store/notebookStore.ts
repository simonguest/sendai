import { reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { Notebook, Output } from "@renderer/schemas/notebook";

export type OutputType = "result" | "stdout" | "error";

export const notebookStore = reactive({
  content: {} as Notebook,
  findCell(cellId: string) {
    if (!this.content.cells) {
      return null;
    }
    return this.content.cells.find(cell => cell.id === cellId);
  },
  getSource(cellId: string) {
    const cell = this.findCell(cellId);
    return cell ? cell.source : null;
  },
  getLocalizedSource(cellId: string, locale: string) : string[] | undefined {
    const cell = this.findCell(cellId);
    if (!cell) return undefined;
    if (!cell.source) return undefined;

    return cell.source
      .map(line => {
        if (line === "__TEMPLATE__") {
          if (cell.metadata["__TEMPLATE__"][locale]) {
            return cell.metadata["__TEMPLATE__"][locale];
          } else {
            // locale not found in template. Return default value instead.
            if (cell.metadata["__TEMPLATE__"]["default"]) {
              return cell.metadata["__TEMPLATE__"]["default"];
            } else {
              return "";
            }
          }
        } else {
          return line;
        }
      })
      .flat();
  },
  setSource(cellId: string, source: string[]) {
    const cell = this.findCell(cellId);
    if (cell) {
      // Add \n chars to the end of each source line
      source = source.map(line => line + "\n");
      cell.source = source;
    }
  },
  clearOutputs(cellId: string) {
    const cell = this.findCell(cellId);
    if (cell) {
      cell.outputs = [];
    }
  },
  getOutputTypes(cellId: string) {
    let result: OutputType[] = [];
    const cell = this.findCell(cellId);
    if (cell) {
      if (
        cell.outputs?.findIndex((output: Output) => output.output_type === "execute_result") !== -1
      ) {
        result.push("result");
      }
      if (
        cell.outputs?.findIndex(
          (output: Output) => output.output_type === "stream" && output.name === "stdout"
        ) !== -1
      ) {
        result.push("stdout");
      }
      if (cell.outputs?.findIndex((output: Output) => output.output_type === "error") !== -1) {
        result.push("error");
      }
    }
    return result;
  },
  addStdout(cellId: string, stdout: string) {
    const cell = this.findCell(cellId);
    if (cell) {
      if (!cell.outputs) cell.outputs = [];
      const index = cell.outputs.findIndex(
        (output: Output) => output.output_type === "stream" && output.name === "stdout"
      );
      if (index !== -1) {
        if (!cell.outputs[index].text) {
          cell.outputs[index].text = [];
        }
        cell.outputs[index].text.push(stdout);
      } else {
        cell.outputs.push({
          output_type: "stream",
          name: "stdout",
          text: [stdout],
        });
      }
    }
  },
  getStdout(cellId: string) {
    let console = "";
    const cell = this.findCell(cellId);
    if (cell) {
      cell.outputs?.forEach(output => {
        if (output.output_type === "stream") {
          console += output.text?.join("") || "";
        }
      });
    }
    return console;
  },
  setResult(cellId: string, result: any) {
    const cell = this.findCell(cellId);
    if (cell) {
      if (!cell.outputs) cell.outputs = [];

      // Find if there's already an execute_result output
      const executeResultIndex = cell.outputs.findIndex(
        (output: Output) => output.output_type === "execute_result"
      );

      if (executeResultIndex !== -1) {
        // If execute_result already exists, merge the data objects
        const existingData = cell.outputs[executeResultIndex].data || {};
        cell.outputs[executeResultIndex].data = {
          ...existingData,
          ...result,
        };
      } else {
        // If no execute_result exists, create a new one
        cell.outputs.push({
          output_type: "execute_result",
          data: result,
        });
      }
    }
  },
  getResult(cellId: string) {
    let result = {};
    const cell = this.findCell(cellId);
    if (cell) {
      cell.outputs?.forEach(output => {
        if (output.output_type === "execute_result") {
          if (output.data) {
            result = output.data;
          }
        }
      });
    }
    return result;
  },
  setError(cellId: string, traceback: string | string[]) {
    const cell = this.findCell(cellId);
    if (cell) {
      if (!cell.outputs) cell.outputs = [];
      const tracebackArray = Array.isArray(traceback) ? traceback : traceback.split("\n");
      cell.outputs.push({
        output_type: "error",
        traceback: tracebackArray,
      });
    }
  },
  getError(cellId: string) {
    let error = "";
    const cell = this.findCell(cellId);
    if (cell) {
      cell.outputs?.forEach(output => {
        if (output.output_type === "error") {
          error += output.traceback?.join("") || "";
        }
      });
    }
    return error;
  },
  loadNotebook(notebook: Notebook) {
    // check for the existance of valid cell ids - if no valid one, assign a UUID
    if (notebook.cells) {
      notebook.cells.forEach(cell => {
        if (!cell.id || typeof cell.id !== "string" || cell.id.trim() === "") {
          cell.id = uuidv4();
        }
      });
      this.content = notebook;
    }
  },
});
