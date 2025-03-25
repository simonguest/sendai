/**
 * Extended metadata types for notebook and cells
 */

/**
 * Extended metadata for cells beyond the standard Jupyter specification
 */
export interface ExtendedCellMetadata {
  /** Content type for raw cells */
  content_type?: string;
}

/**
 * Interface used for extended notebook metadata
 */
export interface ExtendedNotebookMetadata {
  /** Title of the notebook for display purposes */
  title?: string;
  /** Description of the notebook */
  description?: string;
  /** Learning objectives for the notebook */
  learning_objectives?: string[];
}
