import { Scanner, TokenType } from "./scanner";

describe("Scanner", () => {
  test("token types", () => {
    function getTokens(source: string): number[] {
      return new Scanner(source).scan().map((t) => t.type);
    }

    expect(getTokens("")).toEqual([TokenType.EOF]);

    expect(getTokens("// this is some comment")).toEqual([TokenType.EOF]);

    expect(getTokens("()")).toEqual([
      TokenType.LEFT_PAREN,
      TokenType.RIGHT_PAREN,
      TokenType.EOF,
    ]);

    expect(getTokens("() == ()")).toEqual([
      TokenType.LEFT_PAREN,
      TokenType.RIGHT_PAREN,
      TokenType.EQUAL_EQUAL,
      TokenType.LEFT_PAREN,
      TokenType.RIGHT_PAREN,
      TokenType.EOF,
    ]);

    expect(getTokens("(( )){}")).toEqual([
      TokenType.LEFT_PAREN,
      TokenType.LEFT_PAREN,
      TokenType.RIGHT_PAREN,
      TokenType.RIGHT_PAREN,
      TokenType.LEFT_BRACE,
      TokenType.RIGHT_BRACE,
      TokenType.EOF,
    ]);

    expect(getTokens('"hello world!"')).toEqual([
      TokenType.STRING,
      TokenType.EOF,
    ]);

    expect(getTokens('"hello world!"')).toEqual([
      TokenType.STRING,
      TokenType.EOF,
    ]);
  });
});
