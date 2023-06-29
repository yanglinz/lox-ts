interface CodeEditorProps {
  id: string;
}

export function CodeEditor(props: CodeEditorProps) {
  return (
    <div class="w-full">
      <textarea
        class="
          w-full p-2
          bg-yellow-50 border border-solid border-stone-200 rounded-sm
          font-mono text-sm
        "
        id={props.id}
        cols={80}
        rows={20}
      ></textarea>
    </div>
  );
}
