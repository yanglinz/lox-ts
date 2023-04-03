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
  });

  test("should get lexeme and literals for strings", () => {
    const tokens = new Scanner('"hello world!"').scan();
    expect(tokens).toMatchInlineSnapshot(`
      [
        Token {
          "lexeme": ""hello world!"",
          "line": 1,
          "literal": "",
          "type": Symbol(STRING),
        },
        Token {
          "lexeme": "",
          "line": 1,
          "literal": "",
          "type": Symbol(EOF),
        },
      ]
    `);
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

  test("should get lexeme and literals for numbers", () => {
    const tokens = new Scanner("123.123").scan();
    expect(tokens).toMatchInlineSnapshot(`
      [
        Token {
          "lexeme": "123.123",
          "line": 1,
          "literal": "",
          "type": Symbol(NUMBER),
        },
        Token {
          "lexeme": "",
          "line": 1,
          "literal": "",
          "type": Symbol(EOF),
        },
      ]
    `);
  });

  test("should get valid token types for reserved keywrods", () => {
    expect(getTokens("false == false")).toEqual([
      TokenType.FALSE,
      TokenType.EQUAL_EQUAL,
      TokenType.FALSE,
    ]);
    expect(getTokens('1.1 or "something"')).toEqual([
      TokenType.NUMBER,
      TokenType.OR,
      TokenType.STRING,
    ]);
    expect(getTokens("true and nil")).toEqual([
      TokenType.TRUE,
      TokenType.AND,
      TokenType.NIL,
    ]);
  });

  test("should get valid token types for reserved keywrods", () => {
    expect(getTokens("falsey == falsey")).toEqual([
      TokenType.IDENTIFIER,
      TokenType.EQUAL_EQUAL,
      TokenType.IDENTIFIER,
    ]);
    expect(getTokens("true_and_false")).toEqual([TokenType.IDENTIFIER]);
  });

  test("should get lexeme and valid token types for reserved keywords", () => {
    const tokens = new Scanner("false or true").scan();
    expect(tokens).toMatchInlineSnapshot(`
      [
        Token {
          "lexeme": "false",
          "line": 1,
          "literal": "",
          "type": Symbol(FALSE),
        },
        Token {
          "lexeme": "or",
          "line": 1,
          "literal": "",
          "type": Symbol(OR),
        },
        Token {
          "lexeme": "true",
          "line": 1,
          "literal": "",
          "type": Symbol(TRUE),
        },
        Token {
          "lexeme": "",
          "line": 1,
          "literal": "",
          "type": Symbol(EOF),
        },
      ]
    `);
  });

  test("should get lexeme and valid token types for identifiers", () => {
    const tokens = new Scanner('var true_or_false = "12345"').scan();
    expect(tokens).toMatchInlineSnapshot(`
      [
        Token {
          "lexeme": "var",
          "line": 1,
          "literal": "",
          "type": Symbol(VAR),
        },
        Token {
          "lexeme": "true_or_false",
          "line": 1,
          "literal": "",
          "type": Symbol(IDENTIFIER),
        },
        Token {
          "lexeme": "=",
          "line": 1,
          "literal": "",
          "type": Symbol(EQUAL),
        },
        Token {
          "lexeme": ""12345"",
          "line": 1,
          "literal": "",
          "type": Symbol(STRING),
        },
        Token {
          "lexeme": "",
          "line": 1,
          "literal": "",
          "type": Symbol(EOF),
        },
      ]
    `);
  });

  // TODO: Detecting unclosed strings
});
