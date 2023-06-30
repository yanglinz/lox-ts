import { CodeControls } from "./CodeControls";
import { CodeEditor } from "./CodeEditor";
import { CodeOutput } from "./CodeOutput";
import { Header } from "./Header";
import { Lox, RecordedLogger } from "lox-ts-interpreter";
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
    const logger = new RecordedLogger();
    const lox = new Lox({ logger });
    lox.run(source);

    dispatch({
      type: "INTERPRET_SOURCE",
      source,
      stdout: logger.messages,
      stderr: [],
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
        <CodeOutput />
      </div>
    </div>
  );
}

export const Root = <App />;
