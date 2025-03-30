import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import type { Notebook, Cell } from '@/renderer/schemas/notebook';

export const notebookStore = reactive({
  content: {} as Notebook,
  loadNotebook(notebook: Notebook) {
    // check for the existance of valid cell ids - if no valid one, assign a UUID
    if (notebook.cells) {
      notebook.cells.forEach(cell => {
        if (!cell.id || typeof cell.id !== 'string' || cell.id.trim() === '') {
          cell.id = uuidv4();
        }
      });
      this.content = notebook;
    }
  }
})
