import { Scanner } from "./scanner";
import { Parser } from "./parser";

function getParsed(source: string): any {
  let tokens = new Scanner(source).scan();
  let parser = new Parser(tokens);
  return parser.parse();
}

describe("Parser should parse expressions", () => {
  test("comparison", () => {
    expect(getParsed("false == false")).toEqual(123);
  });
});
