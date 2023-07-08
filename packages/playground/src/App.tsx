import { CodeControls } from "./CodeControls";
import { CodeEditor } from "./CodeEditor";
import { CodeOutput } from "./CodeOutput";
import { Header } from "./Header";
import { Lox } from "lox-ts-interpreter";
import { useEffect, useReducer } from "preact/hooks";

const initialState = {
  source: "",
  stream: [],
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "INTERPRET_SOURCE": {
      const { source, stream } = action;
      return { ...state, source, stream };
    }
    default: {
      throw new Error("Unexpected action in appReducer");
    }
  }
};

function App() {
  const [appState, dispatch] = useReducer(appReducer, initialState);

  const editorId = "mainEditor";
  const getEditorEl = () => {
    const textArea = document.getElementById(editorId) as HTMLTextAreaElement;
    return textArea;
  };

  const interpret = (source) => {
    const instance = new Lox().run(source);
    dispatch({
      type: "INTERPRET_SOURCE",
      source,
      stream: instance.lox.stream,
    });
  };

  const loadAndRunExample = (exampleId) => {
    const url = `/examples/${exampleId}`;

    fetch(url)
      .then((r) => r.text())
      .then((s) => {
        getEditorEl().value = s;
        interpret(s);
      })
      // TODO: Implement proper error handling
      .catch((e) => console.error(e));
  };

  const onClickRun = () => {
    const source = getEditorEl().value;
    interpret(source);
  };

  const onChangeExample = (e) => {
    const exampleId = e.target.value;
    loadAndRunExample(exampleId);
  };

  const defaultExampleId = "HelloWorld.lox";
  useEffect(() => {
    loadAndRunExample(defaultExampleId);
  }, []);

  return (
    <div>
      <Header />
      <div class="mt-5 mx-5">
        <CodeControls
          defaultExampleId={defaultExampleId}
          onChangeExample={onChangeExample}
          onClickRun={onClickRun}
        />
      </div>
      <div class="m-5 border border-solid border-stone-200 rounded-sm">
        <div>
          <CodeEditor id={editorId} />
        </div>
        <div class="border-t border-solid border-stone-200">
          <CodeOutput stream={appState.stream} />
        </div>
      </div>
    </div>
  );
}

export const Root = <App />;
