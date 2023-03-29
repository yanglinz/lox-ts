export type TokenTypeConstant = number;

type _TokenType = {
  [key: string]: TokenTypeConstant;
};

export const TokenType: _TokenType = {
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

type _TokenLiterals = {
  [key: string]: number;
};

export const TokenLiterals: _TokenLiterals = {
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

export class Scanner {
  source: string;

  #start: number = 0;
  #current: number = 0;
  #line: number = 1;

  #tokens: Token[] = [];
  #errors: any[] = [];

  constructor(source: string) {
    this.source = source;
  }

  scan(): Token[] {
    if (this.source) {
      while (!this.#isAtEnd()) {
        this.#start = this.#current;
        this.#scanNext();
      }
    }

    this.#addToken(TokenType.EOF);
    return this.#tokens;
  }

  #scanNext(): void {
    let c = this.#advance();

    // Match single char literals
    if (c in TokenLiterals) {
      const tokenType = TokenLiterals[c];
      this.#addToken(tokenType);
    }

    // Match operators
    else if (c === "!") {
      this.#addToken(this.#match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
    } else if (c === "=") {
      this.#addToken(
        this.#match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
      );
    } else if (c === "<") {
      this.#addToken(this.#match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
    } else if (c === ">") {
      this.#addToken(
        this.#match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
      );
    }

    // Match slash and comments
    else if (c === "/") {
      if (this.#match("/")) {
        while (this.#peek() !== "\n" && !this.#isAtEnd()) {
          this.#advance();
        }
      } else {
        this.#addToken(TokenType.SLASH);
      }
    }

    // Match white spaces
    else if (c === " " || c === "\r" || c === "\t") {
      // These white spaces can be ignored
    } else if (c === "\n") {
      this.#line += 1;
    }

    // Match string literals
    else if (c === '"') {
      while (this.#peek() !== '"' && !this.#isAtEnd()) {
        if (this.#peek() === "\n") {
          this.#line += 1;
        }
        this.#advance();
      }

      if (this.#isAtEnd()) {
        this.#addError("Unterminated string");
      }

      // The closing "
      this.#advance();
      const stringValue = this.source.slice(this.#start + 1, this.#current - 1);
      this.#addToken(TokenType.STRING, stringValue);
    } else {
      // If the character can't be handled by the above logic, it must be unexpected
      this.#addError("Unexpected char");
    }
  }

  /**
   * Helper method to determine if we've scanned all source string into tokens
   */
  #isAtEnd(): boolean {
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
    if (this.#isAtEnd()) {
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
    if (this.#isAtEnd()) {
      return;
    }

    return this.source[this.#current];
  }

  #addToken(tokenType: number, literal?: string): void {
    const lexeme = this.source.slice(this.#start, this.#current);
    this.#tokens.push(new Token(tokenType, lexeme, literal, this.#line));
  }

  #addError(message?: string) {
    let error = "Unexpected character";
    // TODO: Create an error class and include contextual info
    this.#errors.push(error);
  }
}
