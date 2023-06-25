import { ParseError, ScanError } from "../packages/lox-interpreter/lox/Errors";
import { LoxInstance, NoopLogger } from "../packages/lox-interpreter/lox/Instance";
import { Lox } from "../packages/lox-interpreter/lox/Lox";

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
    expect(lox.errors.every((e) => e instanceof ScanError)).toEqual(true);
    expect(lox.errors.map((e) => e.message)).toEqual(["Unterminated string"]);
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
    expect(lox.errors.every((e) => e instanceof ParseError)).toEqual(true);
    expect(lox.errors.map((e) => e.message)).toEqual([
      "Expect ';' after value.",
    ]);
  });
});
