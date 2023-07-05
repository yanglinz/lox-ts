interface CodeEditorProps {
  id: string;
}

export function CodeEditor(props: CodeEditorProps) {
  return (
    <div class="flex w-full">
      <textarea
        class="
          w-full p-5
          bg-yellow-50
          font-mono text-sm
        "
        id={props.id}
        cols={80}
        rows={20}
      ></textarea>
    </div>
  );
}
