import { ExprLiteralValue } from "./Expr";
import { NoopLogger } from "./Instance";
import { Lox } from "./Lox";

function interpretValue(source: string): ExprLiteralValue {
  const lox = new Lox({ logger: new NoopLogger() });
  return lox.run(source).value;
}

function interpretPrints(source: string): ExprLiteralValue[] {
  const lox = new Lox({ logger: new NoopLogger() });
  const instance = lox.run(source).lox;
  return instance.streamPrint.map((p) => p.message);
}

describe("Interpreting statements", () => {
  test("simple unary expressions", () => {
    // minus operator
    expect(interpretValue("-1;")).toEqual(-1);
    expect(interpretValue("-123;")).toEqual(-123);
    expect(interpretValue("-(-1);")).toEqual(1);
    expect(interpretValue("-(-(-1));")).toEqual(-1);

    // bang operator
    expect(interpretValue("!false;")).toEqual(true);
    expect(interpretValue("!true;")).toEqual(false);
    expect(interpretValue("!!true;")).toEqual(true);
    expect(interpretValue("!!false;")).toEqual(false);
  });

  test("simple binary expressions", () => {
    // minus operator
    expect(interpretValue("1 - 1;")).toEqual(0);
    expect(interpretValue("123 - 124;")).toEqual(-1);

    // slash operator
    expect(interpretValue("1 / 1;")).toEqual(1);
    expect(interpretValue("10 / 1;")).toEqual(10);
    expect(interpretValue("10 / 5;")).toEqual(2);

    // star operator
    expect(interpretValue("1 * 1;")).toEqual(1);
    expect(interpretValue("1 * 0;")).toEqual(0);
    expect(interpretValue("0 * 1;")).toEqual(0);
    expect(interpretValue("10 * 5;")).toEqual(50);

    // plus operator
    expect(interpretValue("1 + 1;")).toEqual(2);
    expect(interpretValue("1 + (-1);")).toEqual(0);
    expect(interpretValue('"foo" + "bar";')).toEqual("foobar");

    // comparison operators
    expect(interpretValue("1 < 1;")).toEqual(false);
    expect(interpretValue("1 < 123;")).toEqual(true);
    expect(interpretValue("123 < 1;")).toEqual(false);
    expect(interpretValue("1 <= 1;")).toEqual(true);
    expect(interpretValue("1 <= 123;")).toEqual(true);

    expect(interpretValue("1 > 1;")).toEqual(false);
    expect(interpretValue("1 > 123;")).toEqual(false);
    expect(interpretValue("123 > 1;")).toEqual(true);
    expect(interpretValue("1 >= 1;")).toEqual(true);
    expect(interpretValue("123 >= 1;")).toEqual(true);

    // equality operators
    expect(interpretValue("nil == nil;")).toEqual(true);
    expect(interpretValue("nil == 1;")).toEqual(false);
    expect(interpretValue("1 == 1;")).toEqual(true);
    expect(interpretValue("123 == 1;")).toEqual(false);
    expect(interpretValue("true == true;")).toEqual(true);
    expect(interpretValue("false == false;")).toEqual(true);
    expect(interpretValue("true == false;")).toEqual(false);
    expect(interpretValue('"foo" == "foo";')).toEqual(true);
    expect(interpretValue('"foo" == "bar";')).toEqual(false);
  });

  test("variable declarations", () => {
    const source = `
      var a = 1;
      var b = 2;
      b = 3;
      print a + b;
    `;
    expect(interpretPrints(source)).toEqual([4]);
  });

  test("variable scoping", () => {
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
    expect(interpretPrints(source)).toEqual([
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
    const source = `
      if (true) { print 1; }
      if (false) { print 2; }
      if (true) { print 3; } else { print 4; }
      if (false) { print 5; } else { print 6; }
    `;
    expect(interpretPrints(source)).toEqual([1, 3, 6]);
  });

  test("logical expressions", () => {
    const source = `
      print 1 or 2;
      print 0 or 3;
      print 0 and 4;
      print 5 and 6;
    `;
    expect(interpretPrints(source)).toEqual([1, 3, 0, 6]);
  });

  test("while loop", () => {
    const source = `
      var i = 0;
      while (i < 5) {
        print i;
        i = i + 1;
      }
    `;
    expect(interpretPrints(source)).toEqual([0, 1, 2, 3, 4]);
  });

  test("for loop", () => {
    const source = `
      for (var i = 0; i < 5; i = i + 1) {
        print i;
      }
    `;
    expect(interpretPrints(source)).toEqual([0, 1, 2, 3, 4]);
  });

  test("function call", () => {
    const source = `
      print clock();
    `;
    const prints = interpretPrints(source);

    expect(prints.length).toEqual(1);
    const actual = prints[0].toString();
    const expected = Date.now().toString();
    expect(actual.length).toEqual(expected.length);
    expect(actual.substring(0, 5)).toEqual(expected.substring(0, 5));
  });

  test("function declaration", () => {
    const source = `
      fun add(a, b, c) {
        print a + b + c;
      }

      add(1, 2, 3);
      add(4, 5, 6);
      add(7, 8, 9);
    `;
    expect(interpretPrints(source)).toEqual([6, 15, 24]);
  });

  test("function call with return", () => {
    const source = `
      fun fib(n) {
        if (n <= 1) return n;
        return fib(n - 2) + fib(n - 1);
      }

      print fib(8);
    `;
    expect(interpretPrints(source)).toEqual([21]);
  });
});
