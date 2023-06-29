import { CodeEditor } from "./CodeEditor";
import { Controls } from "./Controls";
import { Header } from "./Header";
import { Lox } from "lox-ts-interpreter";
import { useReducer } from "preact/hooks";

const initialState = {
  source: "",
  stdout: [],
  stderr: [],
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "INTERPRET_SOURCE": {
      const { source } = action;
      return { ...state, source };
    }
    default: {
      throw new Error("Unexpected action in appReducer");
    }
  }
};

function App() {
  const [appState, dispatch] = useReducer(appReducer, initialState);

  const editorId = "mainEditor";
  const onClickRun = () => {
    // Get the value of the editor input as source
    const textArea = document.getElementById(editorId) as HTMLTextAreaElement;
    const source = textArea.value;

    // Interpret the source code
    const lox = new Lox();
    const { lox: instance } = lox.run(source);
    // TODO: Use the output to populate stdout and stderr
    const output = instance.errors;
    () => output;

    dispatch({ type: "INTERPRET_SOURCE", source, stdout: [], stderr: [] });
  };

  return (
    <div>
      <Header />
      <div class="pt-5 px-5">
        <Controls onClickRun={onClickRun} />
      </div>
      <div class="p-5">
        <CodeEditor id={editorId} />
      </div>
    </div>
  );
}

export const Root = <App />;
