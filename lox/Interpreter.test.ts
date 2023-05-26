import { LoxInstance } from "./Instance";
import { Scanner } from "./Scanner";
import { Parser } from "./Parser";
import { Interpreter } from "./Interpreter";
import { Resolver } from "./Resolver";
import { RecordedLogger } from "./Instance";
import { ExprLiteralValue } from "./Expr";

function interpret(source: string, logger?: RecordedLogger): ExprLiteralValue {
  let lox = new LoxInstance(logger);
  let interpreter = new Interpreter(lox);
  let tokens = new Scanner(lox, source).scan();
  let parser = new Parser(lox, tokens);
  let statements = parser.parse();
  const resolver = new Resolver(interpreter);
  resolver.resolveAll(statements);
  return interpreter.interpret(statements);
}

describe("Interpreting statements", () => {
  test("simple unary expressions", () => {
    // minus operator
    expect(interpret("-1;")).toEqual(-1);
    expect(interpret("-123;")).toEqual(-123);
    expect(interpret("-(-1);")).toEqual(1);
    expect(interpret("-(-(-1));")).toEqual(-1);

    // bang operator
    expect(interpret("!false;")).toEqual(true);
    expect(interpret("!true;")).toEqual(false);
    expect(interpret("!!true;")).toEqual(true);
    expect(interpret("!!false;")).toEqual(false);
  });

  test("simple binary expressions", () => {
    // minus operator
    expect(interpret("1 - 1;")).toEqual(0);
    expect(interpret("123 - 124;")).toEqual(-1);

    // slash operator
    expect(interpret("1 / 1;")).toEqual(1);
    expect(interpret("10 / 1;")).toEqual(10);
    expect(interpret("10 / 5;")).toEqual(2);

    // star operator
    expect(interpret("1 * 1;")).toEqual(1);
    expect(interpret("1 * 0;")).toEqual(0);
    expect(interpret("0 * 1;")).toEqual(0);
    expect(interpret("10 * 5;")).toEqual(50);

    // plus operator
    expect(interpret("1 + 1;")).toEqual(2);
    expect(interpret("1 + (-1);")).toEqual(0);
    expect(interpret('"foo" + "bar";')).toEqual("foobar");

    // comparison operators
    expect(interpret("1 < 1;")).toEqual(false);
    expect(interpret("1 < 123;")).toEqual(true);
    expect(interpret("123 < 1;")).toEqual(false);
    expect(interpret("1 <= 1;")).toEqual(true);
    expect(interpret("1 <= 123;")).toEqual(true);

    expect(interpret("1 > 1;")).toEqual(false);
    expect(interpret("1 > 123;")).toEqual(false);
    expect(interpret("123 > 1;")).toEqual(true);
    expect(interpret("1 >= 1;")).toEqual(true);
    expect(interpret("123 >= 1;")).toEqual(true);

    // equality operators
    expect(interpret("nil == nil;")).toEqual(true);
    expect(interpret("nil == 1;")).toEqual(false);
    expect(interpret("1 == 1;")).toEqual(true);
    expect(interpret("123 == 1;")).toEqual(false);
    expect(interpret("true == true;")).toEqual(true);
    expect(interpret("false == false;")).toEqual(true);
    expect(interpret("true == false;")).toEqual(false);
    expect(interpret('"foo" == "foo";')).toEqual(true);
    expect(interpret('"foo" == "bar";')).toEqual(false);
  });

  test("variable declarations", () => {
    const logger = new RecordedLogger();
    const source = `
      var a = 1;
      var b = 2;
      b = 3;
      print a + b;
    `;
    interpret(source, logger);
    expect(logger.messages).toEqual([4]);
  });

  test("variable scoping", () => {
    const logger = new RecordedLogger();
    const source = `
      var a = "global a";
      var b = "global b";
      var c = "global c";
      {
        var a = "outer a";
        var b = "outer b";
        {
          var a = "inner a";
          print a;
          print b;
          print c;
        }
        print a;
        print b;
        print c;
      }
      print a;
      print b;
      print c;
    `;
    interpret(source, logger);
    expect(logger.messages).toEqual([
      "inner a",
      "outer b",
      "global c",
      "outer a",
      "outer b",
      "global c",
      "global a",
      "global b",
      "global c",
    ]);
  });

  test("if statements", () => {
    const logger = new RecordedLogger();
    const source = `
      if (true) { print 1; }
      if (false) { print 2; }
      if (true) { print 3; } else { print 4; }
      if (false) { print 5; } else { print 6; }
    `;
    interpret(source, logger);
    expect(logger.messages).toEqual([1, 3, 6]);
  });

  test("logical expressions", () => {
    const logger = new RecordedLogger();
    const source = `
      print 1 or 2;
      print 0 or 3;
      print 0 and 4;
      print 5 and 6;
    `;
    interpret(source, logger);
    expect(logger.messages).toEqual([1, 3, 0, 6]);
  });

  test("while loop", () => {
    const logger = new RecordedLogger();
    const source = `
      var i = 0;
      while (i < 5) {
        print i;
        i = i + 1;
      }
    `;
    interpret(source, logger);
    expect(logger.messages).toEqual([0, 1, 2, 3, 4]);
  });

  test("for loop", () => {
    const logger = new RecordedLogger();
    const source = `
      for (var i = 0; i < 5; i = i + 1) {
        print i;
      }
    `;
    interpret(source, logger);
    expect(logger.messages).toEqual([0, 1, 2, 3, 4]);
  });

  test("function call", () => {
    const logger = new RecordedLogger();
    const source = `
      print clock();
    `;
    interpret(source, logger);
    expect(logger.messages).toEqual([Date.now()]);
  });

  test("function declaration", () => {
    const logger = new RecordedLogger();
    const source = `
      fun add(a, b, c) {
        print a + b + c;
      }

      add(1, 2, 3);
      add(4, 5, 6);
      add(7, 8, 9);
    `;
    interpret(source, logger);
    expect(logger.messages).toEqual([6, 15, 24]);
  });

  test("function call with return", () => {
    const logger = new RecordedLogger();
    const source = `
      fun fib(n) {
        if (n <= 1) return n;
        return fib(n - 2) + fib(n - 1);
      }

      print fib(8);
    `;
    interpret(source, logger);
    expect(logger.messages).toEqual([21]);
  });
});
