import { EditorView } from "codemirror";

export const defaultTheme = EditorView.theme({
  "&": {
    fontSize: "10.5pt",
    border: "0px",
    borderRadius: "5px",
    background: "#ffffff"
  },
  ".cm-content": {
    fontFamily: "JetBrainsMono, monospace",
    minHeight: "100px",
  },
  ".cm-gutters": {
    minHeight: "100px",
  },
  ".cm-scroller": {
    overflow: "auto",
    maxHeight: "600px",
  }
});
