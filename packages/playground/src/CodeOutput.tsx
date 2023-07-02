import { StreamError, StreamPrint } from "lox-ts-interpreter";

interface CodeOutputProps {
  stream: (StreamPrint | StreamError)[];
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
          {props.stream.map((s, i) => {
            if (s.type === "print") {
              return (
                <li key={i + s.message}>
                  <span class="font-mono text-sm text-stone-400">{"> "}</span>
                  <span class="font-mono text-sm text-stone-800">
                    {s.message}
                  </span>
                </li>
              );
            }
            if (s.type === "error") {
              return (
                <li key={i + s.error.message}>
                  <span class="font-mono text-sm text-stone-400">{"> "}</span>
                  <span class="font-mono text-sm text-stone-800">
                    {s.error.message}
                  </span>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
}
