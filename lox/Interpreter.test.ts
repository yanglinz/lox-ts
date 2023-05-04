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
  test("comparison", () => {
    let source = '!false';
    expect(getInterpretedResult(source)).toEqual(true);
  });
});
