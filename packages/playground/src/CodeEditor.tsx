import { createRef, Component } from 'preact';
import {EditorView, basicSetup} from "codemirror"

interface CodeEditorProps {
  id: string;
}

export class CodeEditor extends Component {
  ref = createRef();

  componentDidMount() {
    if (this.ref.current) {
      let editor = new EditorView({
        extensions: [basicSetup],
        parent: this.ref.current
      })
    }
  }

  render() {
    return (
      <div ref={this.ref}>
      </div>
    );
  }
}
