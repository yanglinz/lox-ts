export function CodeEditor() {
  return (
    <div class="py-5 px-5">
      <textarea
        class="
          w-full p-2
          bg-yellow-50 border border-solid border-slate-200 rounded-sm
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
