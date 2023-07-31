import { EditorView, basicSetup } from "codemirror";

export class CodeEditorSingleton {
  editor: EditorView;

  constructor() {
    this.editor = null;
  }

  init(parentNode) {
    this.editor = new EditorView({
      extensions: [basicSetup],
      parent: parentNode,
    });
  }

  get currentText() {
    return this.editor.state.doc.toString();
  }

  replaceText(s: string) {
    this.editor.dispatch({
      changes: { from: 0, to: this.currentText.length, insert: s },
    });
  }
}
