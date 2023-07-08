interface CodeControlsProps {
  defaultExampleId: string;
  onChangeExample: (e: Event) => void;
  onClickRun: (e: Event) => void;
}

const examples = [
  ["HelloWorld.lox", "Hello World"],
  ["Addition.lox", "Simple Addition"],
];

export function CodeControls(props: CodeControlsProps) {
  return (
    <div class="flex items-stretch">
      <div
        class="
          bg-stone-100 pr-2 mr-2
          border border-solid border-stone-200 rounded-sm
        "
      >
        <select
          class="bg-stone-100 py-2 pl-2"
          defaultValue={props.defaultExampleId}
          onChange={props.onChangeExample}
        >
          {examples.map((o) => (
            <option key={o[0]} value={o[0]}>
              {o[1]}
            </option>
          ))}
        </select>
      </div>

      <button
        class="
            bg-stone-100 px-6 py-1
            border border-solid border-stone-200 rounded-sm
          "
        onClick={props.onClickRun}
      >
        Run
      </button>
    </div>
  );
}
