import { CodeControls } from "./CodeControls";
import { CodeEditor } from "./CodeEditor";
import { CodeEditorSingleton } from "./CodeEditorSingleton";
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

const editorSingleton = new CodeEditorSingleton();

function App() {
  const [appState, dispatch] = useReducer(appReducer, initialState);

  const qs = new URLSearchParams(window.location.search);
  const hideHeader = qs.get("hideheader") === "true";

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
        editorSingleton.replaceText(s);
        interpret(s);
      })
      // TODO: Implement proper error handling
      .catch((e) => console.error(e));
  };

  const onClickRun = () => {
    const source = editorSingleton.currentText;
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
      {hideHeader ? null : <Header />}
      <div class={hideHeader ? "mx-5" : "mt-7 mx-5"}>
        <CodeControls
          defaultExampleId={defaultExampleId}
          onChangeExample={onChangeExample}
          onClickRun={onClickRun}
        />
      </div>
      <div class="m-5 border border-solid border-stone-200 rounded-sm">
        <div>
          <CodeEditor editorSingleton={editorSingleton} />
        </div>
        <div class="border-t border-solid border-stone-200">
          <CodeOutput stream={appState.stream} />
        </div>
      </div>
    </div>
  );
}

export const Root = <App />;
