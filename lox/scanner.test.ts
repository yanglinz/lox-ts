import { Scanner, TokenType } from "./scanner";

function getTokens(source: string): number[] {
  return new Scanner(source).scan().map(t => t.type);
}

test("Scanner basic scenarios", () => {
  expect(getTokens("()")).toEqual([
    TokenType.LEFT_PAREN,
    TokenType.RIGHT_PAREN,
  ]);
});
