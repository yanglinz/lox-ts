import { ParseError, ScanError } from "../lox/Errors";
import { LoxInstance, NoopLogger } from "../lox/Instance";
import { Lox } from "../lox/Lox";

function interpret(source: string): LoxInstance {
  const lox = new Lox({ logger: new NoopLogger() });
  return lox.run(source).lox;
}

describe("Errors", () => {
  test("unterminated string", () => {
    const source = `
      "Unterminated string
    `;
    const lox = interpret(source);
    expect(lox.hadError).toEqual(true);
    expect(lox.streamError.every((e) => e.error instanceof ScanError)).toEqual(
      true
    );
    expect(lox.streamError.map((e) => e.error.message)).toEqual([
      "Unterminated string",
    ]);
  });

  test("missing semicolon", () => {
    const source = `
      fun add(a, b, c) {
        print a + b + c;
      }

      add(1, 2, 3)
      add(1, 2, 3);
    `;
    const lox = interpret(source);
    expect(lox.hadError).toEqual(true);
    expect(lox.streamError.every((e) => e.error instanceof ParseError)).toEqual(
      true
    );
    expect(lox.streamError.map((e) => e.error.message)).toEqual([
      "Expect ';' after value.",
    ]);
  });
});
