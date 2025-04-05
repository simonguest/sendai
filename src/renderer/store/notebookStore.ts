import { reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { Notebook, Output } from "@/renderer/schemas/notebook";

export const notebookStore = reactive({
  content: {} as Notebook,
  getCellSource(cellId: string) {
    if (!this.content.cells) {
      return null;
    }
    const cell = this.content.cells.find(cell => cell.id === cellId);
    return cell ? cell.source : null;
  },
  setCellSource(cellId: string, source: string[]) {
    if (!this.content.cells) {
      return;
    }
    
    const cell = this.content.cells.find(cell => cell.id === cellId);
    if (cell) {
      // Add \n chars to the end of each source line
      source = source.map(line => line + "\n");
      cell.source = source
    }
  },
  clearOutputs(cellId: string){
    if (!this.content.cells) {
      return;
    }
    const cell = this.content.cells.find(cell => cell.id === cellId);
    if (cell) {
      cell.outputs = [];
    }
  },
  addStdOut(cellId: string, stdout: string){
    if (!this.content.cells) {
      return;
    }
    const cell = this.content.cells.find(cell => cell.id === cellId);
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
