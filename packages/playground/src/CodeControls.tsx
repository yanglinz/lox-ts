interface CodeControlsProps {
  onClickRun: (e: MouseEvent) => void;
}

export function CodeControls(props: CodeControlsProps) {
  return (
    <div>
      <button
        class="
          bg-stone-100 px-5 py-2
          border border-solid border-stone-200 rounded-sm
        "
        onClick={props.onClickRun}
      >
        Run
      </button>
    </div>
  );
}
