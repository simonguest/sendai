import { watch, ref } from 'vue'
import { notebookStore } from '@renderer/store/notebookStore'
import { saveNotebook } from '../storage/notebookStorage'

// Configuration constants
const AUTO_SAVE_DEBOUNCE_MS = 2000 // Save 2 seconds after last change
const SAVE_STATUS_DISPLAY_MS = 2000 // How long to show "saved" status

export function useNotebookAutoSave(notebookId: string) {
  const saveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const lastSaved = ref<Date | null>(null)
  
  // Debounced save function
  let saveTimeout: NodeJS.Timeout | null = null
  let isInitialized = false
  
  const debouncedSave = async () => {
    if (saveTimeout) clearTimeout(saveTimeout)
    
    saveTimeout = setTimeout(async () => {
      try {
        saveStatus.value = 'saving'
        // Convert reactive object to plain object for IndexedDB
        const plainNotebook = JSON.parse(JSON.stringify(notebookStore.content))
        await saveNotebook(notebookId, plainNotebook)
        saveStatus.value = 'saved'
        lastSaved.value = new Date()
        
        // Reset to idle after showing "saved" for a moment
        setTimeout(() => {
          if (saveStatus.value === 'saved') {
            saveStatus.value = 'idle'
          }
        }, SAVE_STATUS_DISPLAY_MS)
      } catch (error) {
        console.error('Auto-save failed:', error)
        saveStatus.value = 'error'
      }
    }, AUTO_SAVE_DEBOUNCE_MS)
  }
  
  // Watch for changes to the notebook content
  const stopWatcher = watch(
    () => notebookStore.content,
    (newContent, oldContent) => {
      // Skip the first call (initial load)
      if (!isInitialized) {
        isInitialized = true
        return
      }
      
      // Only save if we actually have content
      if (newContent && newContent.cells?.length > 0) {
        debouncedSave()
      }
    },
    { deep: true, immediate: true } // Watch nested changes in cells, trigger immediately
  )
  
  return {
    saveStatus,
    lastSaved,
    stopWatcher
  }
}
