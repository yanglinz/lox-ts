interface CodeOutputProps {
  stdout: string[];
  stderr: string[];
}

export function CodeOutput(props: CodeOutputProps) {
  return (
    <div
      class="
        w-full bg-stone-100 px-5 py-2
        border border-solid border-stone-200 rounded-sm
      "
    >
      <div class="w-full">
        <ul>
          {props.stdout.map((m, i) => (
            <li key={i + m}>
              <span class="font-mono text-sm text-stone-400">{"> "}</span>
              <span class="font-mono text-sm text-stone-800">{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
