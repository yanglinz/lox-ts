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
    <div class="flex">
      <div>
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

      <div>
        <select
          class="
            bg-stone-100 px-6 py-2
            border border-solid border-stone-200 rounded-sm
          "
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
    </div>
  );
}
