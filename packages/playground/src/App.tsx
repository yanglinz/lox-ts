import { CodeEditor } from "./CodeEditor";
import { Controls } from "./Controls";
import { Header } from "./Header";

function App() {
  return (
    <div>
      <Header />
      <div class="pt-5 px-5">
        <Controls />
      </div>
      <div class="p-5">
        <CodeEditor />
      </div>
    </div>
  );
}

export const Root = <App />;
