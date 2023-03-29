import { Scanner, TokenType, TokenTypeConstant } from "./scanner";

function getTokens(source: string): TokenTypeConstant[] {
  const tokens = new Scanner(source).scan().map((t) => t.type);
  expect(tokens.length).toBeGreaterThan(0);
  // Strip the EOF to avoid having to specify it as a part of every test
  expect(tokens.at(-1)).toEqual(TokenType.EOF);
  tokens.pop();
  return tokens;
}

describe("Scanner", () => {
  test("should get valid token types for literals", () => {
    expect(getTokens(";")).toEqual([TokenType.SEMICOLON]);
    expect(getTokens(",")).toEqual([TokenType.COMMA]);
    expect(getTokens("-")).toEqual([TokenType.MINUS]);
    expect(getTokens(".")).toEqual([TokenType.DOT]);
  });

  test("should get valid token types for slashes", () => {
    expect(getTokens("/")).toEqual([TokenType.SLASH]);
    expect(getTokens("// this is some comment")).toEqual([]);
  });

  test("should get valid token types for white spaces", () => {
    expect(getTokens("")).toEqual([]);
    expect(getTokens(" ")).toEqual([]);
    expect(getTokens("\t")).toEqual([]);
    expect(getTokens("\n")).toEqual([]);
  });

  test("should get valid token types for parens", () => {
    expect(getTokens("()")).toEqual([
      TokenType.LEFT_PAREN,
      TokenType.RIGHT_PAREN,
    ]);

    expect(getTokens("() == ()")).toEqual([
      TokenType.LEFT_PAREN,
      TokenType.RIGHT_PAREN,
      TokenType.EQUAL_EQUAL,
      TokenType.LEFT_PAREN,
      TokenType.RIGHT_PAREN,
    ]);

    expect(getTokens("(( )){}")).toEqual([
      TokenType.LEFT_PAREN,
      TokenType.LEFT_PAREN,
      TokenType.RIGHT_PAREN,
      TokenType.RIGHT_PAREN,
      TokenType.LEFT_BRACE,
      TokenType.RIGHT_BRACE,
    ]);
  });

  test("should get valid token types for strings", () => {
    expect(getTokens('"hello world!"')).toEqual([TokenType.STRING]);

    expect(getTokens('"hello world!"')).toEqual([TokenType.STRING]);
  });

  test("should get valid token types for numbers", () => {
    expect(getTokens("123")).toEqual([TokenType.NUMBER]);
    expect(getTokens("123.123")).toEqual([TokenType.NUMBER]);
    expect(getTokens("123;123.123")).toEqual([
      TokenType.NUMBER,
      TokenType.SEMICOLON,
      TokenType.NUMBER,
    ]);
  });

  // Detecting unclosed strings
  // Test for string lexeme and literals
  // Test for number lexeme and literals
  // Test for line count
});
