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
  const onClickRun = () => {
    // Get the value of the editor input as source
    const textArea = document.getElementById(editorId) as HTMLTextAreaElement;
    const source = textArea.value;

    // Interpret the source code
    const instance = new Lox().run(source);

    dispatch({
      type: "INTERPRET_SOURCE",
      source,
      stream: instance.lox.stream,
    });
  };

  return (
    <div>
      <Header />
      <div class="mt-5 mx-5">
        <CodeControls onClickRun={onClickRun} />
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
