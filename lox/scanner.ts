export const TokenType = {
  LEFT_PAREN: 1,
  RIGHT_PAREN: 2,
  LEFT_BRACE: 3,
  RIGHT_BRACE: 4,
  COMMA: 5,
  DOT: 6,
  MINUS: 7,
  PLUS: 8,
  SEMICOLON: 9,
  SLASH: 10,
  STAR: 11,

  // One or two character tokens.
  BANG: 12,
  BANG_EQUAL: 13,
  EQUAL: 14,
  EQUAL_EQUAL: 15,
  GREATER: 16,
  GREATER_EQUAL: 17,
  LESS: 18,
  LESS_EQUAL: 19,
  IDENTIFIER: 20,
  STRING: 21,
  NUMBER: 22,

  // Keywords.
  AND: 23,
  CLASS: 24,
  ELSE: 25,
  FALSE: 26,
  FUN: 27,
  FOR: 28,
  IF: 29,
  NIL: 30,
  OR: 31,
  PRINT: 32,
  RETURN: 33,
  SUPER: 34,
  THIS: 35,
  TRUE: 36,
  VAR: 37,
  WHILE: 38,
  EOF: 39,
};

export const TokenLiterals = {
  "(": TokenType.LEFT_PAREN,
  ")": TokenType.RIGHT_PAREN,
  "{": TokenType.LEFT_BRACE,
  "}": TokenType.RIGHT_BRACE,
  ",": TokenType.COMMA,
  ".": TokenType.DOT,
  "-": TokenType.MINUS,
  "+": TokenType.PLUS,
  ";": TokenType.SEMICOLON,
  "*": TokenType.STAR,
};

export const ReservedKeywords = {
  and: TokenType.AND,
  class: TokenType.CLASS,
  else: TokenType.ELSE,
  false: TokenType.FALSE,
  for: TokenType.FOR,
  fun: TokenType.FUN,
  if: TokenType.IF,
  nil: TokenType.NIL,
  or: TokenType.OR,
  print: TokenType.PRINT,
  return: TokenType.RETURN,
  super: TokenType.SUPER,
  this: TokenType.THIS,
  true: TokenType.TRUE,
  var: TokenType.VAR,
  while: TokenType.WHILE,
};

class Token {
  type: number;
  lexeme: string;
  literal: string;
  line: number;

  constructor(type: number, lexeme: string, literal: string, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }
}

class Scanner {
  source: string;

  #start: number = 0;
  #current: number = 0;
  #line: number = 1;

  #tokens: Token[];
  #errors: any[];

  constructor(source: string) {
    this.source = source;
  }

  scan(): Token[] {
    if (!this.source) {
      return this.#tokens;
    }
  }

  /**
   * Helper method to determine if we've scanned all source string into tokens
   */
  #is_at_end(): boolean {
    return this.#current >= this.source.length;
  }

  /**
   * Helper method to return the current token and advance the current cursor
   */
  #advance(): string | undefined {
    const char = this.source[this.#current];
    this.#current += 1;
    return char;
  }

  /**
   * Helper method to conditionally advance if the current char is what we expect
   */
  #match(expected: string): string | undefined {
    if (this.#is_at_end()) {
      return;
    }

    if (this.source[this.#current] !== expected) {
      return;
    }

    return this.#advance();
  }

  /**
   * Helper method to return the next char without advancing
   */
  #peek(): string | undefined {
    if (this.#is_at_end()) {
      return;
    }

    return this.source[this.#current];
  }
}
