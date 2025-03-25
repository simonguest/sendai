import { reactive } from 'vue'
import type { Notebook } from '@schemas/notebook';

export const store = reactive({
  content: {} as Notebook,
  loadNotebook(notebook: Notebook) {
    this.content = notebook;
  }
})
