import { CodeEditor } from "./CodeEditor";
import { Controls } from "./Controls";
import { Header } from "./Header";

function App() {
  const editorId = "mainEditor";
  const getInputValue = () => {
    const textArea = document.getElementById(editorId) as HTMLTextAreaElement;
    return textArea.value;
  };

  return (
    <div>
      <Header />
      <div class="pt-5 px-5">
        <Controls getInputValue={getInputValue} />
      </div>
      <div class="p-5">
        <CodeEditor id={editorId} />
      </div>
    </div>
  );
}

export const Root = <App />;
