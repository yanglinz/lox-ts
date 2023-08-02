import { StreamError, StreamPrint } from "lox-ts-interpreter";

interface CodeOutputProps {
  stream: (StreamPrint | StreamError)[];
}

function getErrorMessage(stream: StreamError) {
  const token = stream.token || stream.error.token;

  if (!token) {
    return stream.error.message;
  }

  let message = "";
  if (token.type.toString() === "EOF") {
    message = `Line ${token.line} at end: ${stream.error.message}`;
  } else {
    message = `Line ${token.line} at '${token.lexeme}': ${stream.error.message}`;
  }
  return message;
}

export function CodeOutput(props: CodeOutputProps) {
  let inner =
    props.stream.length === 0 ? (
      <div className="w-full pb-5">
        <br />
      </div>
    ) : (
      <div class="w-full pb-5">
        <ul>
          {props.stream.map((s, i) => {
            if (s.type === "print") {
              return (
                <li key={i}>
                  <span class="font-mono text-sm text-stone-400">{"> "}</span>
                  <span class="font-mono text-sm text-stone-800">
                    {`${s.message}`}
                  </span>
                </li>
              );
            }
            if (s.type === "error") {
              return (
                <li key={i + s.error.message}>
                  <span class="font-mono text-sm text-stone-400">{"> "}</span>
                  <span class="font-mono text-sm text-stone-800">
                    {getErrorMessage(s)}
                  </span>
                </li>
              );
            }
          })}
        </ul>
      </div>
    );

  return (
    <div
      class="
        w-full bg-stone-100 p-5
      "
    >
      {inner}
    </div>
  );
}
