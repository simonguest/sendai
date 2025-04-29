import { EditorView } from "codemirror";

export const defaultTheme = EditorView.theme({
  "&": {
    fontSize: "10.5pt",
    border: "1px solid #c0c0c0"
  },
  ".cm-content": {
    fontFamily: "JetBrainsMono, monospace",
    minHeight: "100px"
  },
  ".cm-gutters": {
    minHeight: "100px"
  },
  ".cm-scroller": {
    overflow: "auto",
    maxHeight: "600px"
  }
});