import { Scanner } from "./Scanner";
import { Parser } from "./Parser";
import { Interpreter } from './Interpreter';

function getInterpretedResult(source: string): any {
  let tokens = new Scanner(source).scan();
  let parser = new Parser(tokens);
  let interpreter = new Interpreter();
  return interpreter.evaluate(parser.parse());
}

describe("Interpreting expressions", () => {
  test("simple unary expressions", () => {
    // minus operator
    expect(getInterpretedResult('-1')).toEqual(-1);
    expect(getInterpretedResult('-123')).toEqual(-123);
    expect(getInterpretedResult('-(-1)')).toEqual(1);
    expect(getInterpretedResult('-(-(-1))')).toEqual(-1);

    // bang operator
    expect(getInterpretedResult('!false')).toEqual(true);
    expect(getInterpretedResult('!true')).toEqual(false);
    expect(getInterpretedResult('!!true')).toEqual(true);
    expect(getInterpretedResult('!!false')).toEqual(false);
  });
});
