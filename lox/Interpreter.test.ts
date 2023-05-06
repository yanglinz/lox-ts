import { LoxInstance } from "./Instance";
import { Scanner } from "./Scanner";
import { Parser } from "./Parser";
import { Interpreter } from "./Interpreter";

function interpret(source: string): any {
  let lox = new LoxInstance();
  let interpreter = new Interpreter(lox);
  let tokens = new Scanner(lox, source).scan();
  let parser = new Parser(lox, tokens);
  return interpreter.evaluate(parser.parseExpression());
}

describe("Interpreting expressions", () => {
  test("simple unary expressions", () => {
    // minus operator
    expect(interpret("-1")).toEqual(-1);
    expect(interpret("-123")).toEqual(-123);
    expect(interpret("-(-1)")).toEqual(1);
    expect(interpret("-(-(-1))")).toEqual(-1);

    // bang operator
    expect(interpret("!false")).toEqual(true);
    expect(interpret("!true")).toEqual(false);
    expect(interpret("!!true")).toEqual(true);
    expect(interpret("!!false")).toEqual(false);
  });

  test("simple binary expressions", () => {
    // minus operator
    expect(interpret("1 - 1")).toEqual(0);
    expect(interpret("123 - 124")).toEqual(-1);

    // slash operator
    expect(interpret("1 / 1")).toEqual(1);
    expect(interpret("10 / 1")).toEqual(10);
    expect(interpret("10 / 5")).toEqual(2);

    // star operator
    expect(interpret("1 * 1")).toEqual(1);
    expect(interpret("1 * 0")).toEqual(0);
    expect(interpret("0 * 1")).toEqual(0);
    expect(interpret("10 * 5")).toEqual(50);

    // plus operator
    expect(interpret("1 + 1")).toEqual(2);
    expect(interpret("1 + (-1)")).toEqual(0);
    expect(interpret('"foo" + "bar"')).toEqual("foobar");

    // comparison operators
    expect(interpret("1 < 1")).toEqual(false);
    expect(interpret("1 < 123")).toEqual(true);
    expect(interpret("123 < 1")).toEqual(false);
    expect(interpret("1 <= 1")).toEqual(true);
    expect(interpret("1 <= 123")).toEqual(true);

    expect(interpret("1 > 1")).toEqual(false);
    expect(interpret("1 > 123")).toEqual(false);
    expect(interpret("123 > 1")).toEqual(true);
    expect(interpret("1 >= 1")).toEqual(true);
    expect(interpret("123 >= 1")).toEqual(true);

    // equality operators
    // expect(interpret("null == null")).toEqual(true);
    // expect(interpret("null == 1")).toEqual(false);
    expect(interpret("1 == 1")).toEqual(true);
    expect(interpret("123 == 1")).toEqual(false);
    expect(interpret("true == true")).toEqual(true);
    expect(interpret("false == false")).toEqual(true);
    expect(interpret("true == false")).toEqual(false);
    expect(interpret('"foo" == "foo"')).toEqual(true);
    expect(interpret('"foo" == "bar"')).toEqual(false);
  });
});
