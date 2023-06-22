import { NoopLogger } from "../lox/Instance";
import { Lox } from "../lox/Lox";

type TODO = any;

function interpret(source: string): TODO {
  let lox = new Lox({ logger: new NoopLogger() });
  return lox.run(source);
}

describe("Errors", () => {
  test("unterminated string", () => {
    const source = `
      "Unterminated string
    `;
    let { lox } = interpret(source);
    expect(lox.hadError).toEqual(true);
    expect(lox.errors).toEqual(["Unterminated string"]);
  });

  test("missing semicolon", () => {
    const source = `
      fun add(a, b, c) {
        print a + b + c;
      }

      add(1, 2, 3)
      add(1, 2, 3);
    `;
    let { lox } = interpret(source);
    expect(lox.hadError).toEqual(true);
    expect(lox.errors).toEqual(["Expect ';' after value."]);
  });
});
