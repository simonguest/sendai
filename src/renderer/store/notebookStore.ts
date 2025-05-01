import { reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { Notebook, Output } from "@/renderer/schemas/notebook";

export const notebookStore = reactive({
  content: {} as Notebook,
  findCell(cellId: string){
    if (!this.content.cells) {
      return null;
    }
    return this.content.cells.find(cell => cell.id === cellId);
  },
  getSource(cellId: string) {
    const cell = this.findCell(cellId);
    return cell ? cell.source : null;
  },
  setSource(cellId: string, source: string[]) {
    const cell = this.findCell(cellId);
    if (cell) {
      // Add \n chars to the end of each source line
      source = source.map(line => line + "\n");
      cell.source = source
    }
  },
  clearOutputs(cellId: string){
    const cell = this.findCell(cellId);
    if (cell) {
      cell.outputs = [];
    }
  },
  addStdout(cellId: string, stdout: string){
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
  hasStdout(cellId: string) : boolean {
    const cell = this.findCell(cellId);
    if (cell) {
      const index = cell.outputs?.findIndex(
        (output: Output) => output.output_type === "stream" && output.name === "stdout"
      );
      return (index !== -1);
    } else {
      return false;
    }
  },
  setResult(cellId: string, result: any){
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
          ...result
        };
      } else {
        // If no execute_result exists, create a new one
        cell.outputs.push({
          output_type: "execute_result",
          data: result
        });
      }
    }
  },
  hasResult(cellId: string) : boolean {
    const cell = this.findCell(cellId);
    if (cell) {
      const index = cell.outputs?.findIndex(
        (output: Output) => output.output_type === "execute_result"
      );
      return (index !== -1);
    } else {
      return false;
    }
  },
  setError(cellId: string, traceback: string | string[]){
    const cell = this.findCell(cellId);
    if (cell) {
      if (!cell.outputs) cell.outputs = [];
      const tracebackArray = Array.isArray(traceback) ? traceback : traceback.split("\n");
      cell.outputs.push({
        output_type: "error",
        traceback: tracebackArray
      });
    }
  },
  hasError(cellId: string) : boolean {
    const cell = this.findCell(cellId);
    if (cell) {
      const index = cell.outputs?.findIndex(
        (output: Output) => output.output_type === "error"
      );
      return (index !== -1);
    } else {
      return false;
    }
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
