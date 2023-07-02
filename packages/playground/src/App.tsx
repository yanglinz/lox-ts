import { CodeControls } from "./CodeControls";
import { CodeEditor } from "./CodeEditor";
import { CodeOutput } from "./CodeOutput";
import { Header } from "./Header";
import { Lox } from "lox-ts-interpreter";
import { useReducer } from "preact/hooks";

const initialState = {
  source: "",
  stream: [],
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "INTERPRET_SOURCE": {
      const { source, stdout, stderr } = action;
      return { ...state, source, stdout, stderr };
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
    const instance = lox.run(source);

    dispatch({
      type: "INTERPRET_SOURCE",
      source,
      stream: instance.lox.stream,
    });
  };

  return (
    <div>
      <Header />
      <div class="pt-5 px-5">
        <CodeControls onClickRun={onClickRun} />
      </div>
      <div class="p-5">
        <CodeEditor id={editorId} />
      </div>
      <div class="pb-5 px-5">
        <CodeOutput stream={appState.stream} />
      </div>
    </div>
  );
}

export const Root = <App />;
