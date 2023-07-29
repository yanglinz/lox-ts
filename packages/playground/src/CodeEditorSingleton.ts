import { EditorState, Text } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";

type TODO = any;

export class CodeEditorSingleton {
  editor: TODO;

  constructor() {
    this.editor = null;
  }

  init(parentNode) {
    this.editor = new EditorView({
      extensions: [basicSetup],
      parent: parentNode,
    });
  }
}
