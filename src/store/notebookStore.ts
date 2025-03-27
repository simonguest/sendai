import { reactive } from 'vue'
import type { Notebook } from '@schemas/notebook';

export const notebookStore = reactive({
  content: {} as Notebook,
  loadNotebook(notebook: Notebook) {
    this.content = notebook;
  }
})
