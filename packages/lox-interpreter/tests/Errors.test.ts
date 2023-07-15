import { ParseError, RuntimeError, ScanError } from "../lox/Errors";
import { LoxInstance, NoopLogger } from "../lox/Lox";
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

  test("invalid use of this", () => {
    const source = `
      fun notAMethod() {
        print this;
      }

      notAMethod();
    `;
    const lox = interpret(source);
    expect(lox.hadError).toEqual(true);
    expect(
      lox.streamError.every((e) => e.error instanceof RuntimeError)
    ).toEqual(true);
    expect(lox.streamError.map((e) => e.error.message)).toEqual([
      "Can't use 'this' outside of a class.",
    ]);
  });

  test("invalid return from init", () => {
    const source = `
      class Car {
        init() {
          return 123;
        }
      }
    `;
    const lox = interpret(source);
    expect(lox.hadError).toEqual(true);
    expect(
      lox.streamError.every((e) => e.error instanceof RuntimeError)
    ).toEqual(true);
    expect(lox.streamError.map((e) => e.error.message)).toEqual([
      "Can't return a value from an initializer.",
    ]);
  });

  test("self inheritance", () => {
    const source = `
      class Car < Car {}
    `;
    const lox = interpret(source);
    expect(lox.hadError).toEqual(true);
    expect(
      lox.streamError.every((e) => e.error instanceof RuntimeError)
    ).toEqual(true);
    expect(lox.streamError.map((e) => e.error.message)).toEqual([
      "A class can't inherit from itself.",
    ]);
  });

  // TODO: Don't skip
  test.skip("non-class inheritance", () => {
    const source = `
      var NotAClass = "Not a class!";
      class Car < NotAClass {}
    `;
    const lox = interpret(source);
    expect(lox.hadError).toEqual(true);
    expect(
      lox.streamError.every((e) => e.error instanceof RuntimeError)
    ).toEqual(true);
    expect(lox.streamError.map((e) => e.error.message)).toEqual([
      "Superclass must be a class.",
    ]);
  });
});
