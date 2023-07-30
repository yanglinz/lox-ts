import { Component, createRef } from "preact";

type TODO = any;

interface CodeEditorProps {
  editorSingleton: TODO;
}

export class CodeEditor extends Component<CodeEditorProps> {
  ref = createRef();

  componentDidMount() {
    if (this.ref.current) {
      this.props.editorSingleton.init(this.ref.current);
    }
  }

  render() {
    return <div class="overflow-scroll h-96 bg-amber-50" ref={this.ref}></div>;
  }
}
