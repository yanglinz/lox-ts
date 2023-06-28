export function CodeEditor() {
  return (
    <div>
      <textarea
        class="
          w-full p-2
          bg-yellow-50 border border-solid border-stone-200 rounded-sm
          font-mono text-sm
        "
        name=""
        id=""
        cols={80}
        rows={20}
      ></textarea>
    </div>
  );
}
