import { Scanner } from "./Scanner";
import { Parser } from "./Parser";
import { Interpreter } from "./Interpreter";

function getInterpretedResult(source: string): any {
  let tokens = new Scanner(source).scan();
  let parser = new Parser(tokens);
  let interpreter = new Interpreter();
  return interpreter.evaluate(parser.parse());
}

describe("Interpreting expressions", () => {
  test("simple unary expressions", () => {
    // minus operator
    expect(getInterpretedResult("-1")).toEqual(-1);
    expect(getInterpretedResult("-123")).toEqual(-123);
    expect(getInterpretedResult("-(-1)")).toEqual(1);
    expect(getInterpretedResult("-(-(-1))")).toEqual(-1);

    // bang operator
    expect(getInterpretedResult("!false")).toEqual(true);
    expect(getInterpretedResult("!true")).toEqual(false);
    expect(getInterpretedResult("!!true")).toEqual(true);
    expect(getInterpretedResult("!!false")).toEqual(false);
  });

  test("simple binary expressions", () => {
    // minus operator
    expect(getInterpretedResult("1 - 1")).toEqual(0);
    expect(getInterpretedResult("123 - 124")).toEqual(-1);

    // slash operator
    expect(getInterpretedResult("1 / 1")).toEqual(1);
    expect(getInterpretedResult("10 / 1")).toEqual(10);
    expect(getInterpretedResult("10 / 5")).toEqual(2);

    // star operator
    expect(getInterpretedResult("1 * 1")).toEqual(1);
    expect(getInterpretedResult("1 * 0")).toEqual(0);
    expect(getInterpretedResult("0 * 1")).toEqual(0);
    expect(getInterpretedResult("10 * 5")).toEqual(50);

    // plus operator
    expect(getInterpretedResult("1 + 1")).toEqual(2);
    expect(getInterpretedResult("1 + (-1)")).toEqual(0);
    expect(getInterpretedResult('"foo" + "bar"')).toEqual("foobar");

    // comparison operators
    expect(getInterpretedResult("1 < 1")).toEqual(false);
    expect(getInterpretedResult("1 < 123")).toEqual(true);
    expect(getInterpretedResult("123 < 1")).toEqual(false);
    expect(getInterpretedResult("1 <= 1")).toEqual(true);
    expect(getInterpretedResult("1 <= 123")).toEqual(true);

    expect(getInterpretedResult("1 > 1")).toEqual(false);
    expect(getInterpretedResult("1 > 123")).toEqual(false);
    expect(getInterpretedResult("123 > 1")).toEqual(true);
    expect(getInterpretedResult("1 >= 1")).toEqual(true);
    expect(getInterpretedResult("123 >= 1")).toEqual(true);

    // equality operators
    // expect(getInterpretedResult("null == null")).toEqual(true);
    // expect(getInterpretedResult("null == 1")).toEqual(false);
    expect(getInterpretedResult("1 == 1")).toEqual(true);
    expect(getInterpretedResult("123 == 1")).toEqual(false);
    expect(getInterpretedResult("true == true")).toEqual(true);
    expect(getInterpretedResult("false == false")).toEqual(true);
    expect(getInterpretedResult("true == false")).toEqual(false);
    expect(getInterpretedResult('"foo" == "foo"')).toEqual(true);
    expect(getInterpretedResult('"foo" == "bar"')).toEqual(false);
  });
});
