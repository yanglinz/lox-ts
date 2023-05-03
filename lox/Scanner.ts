export type TokenTypeConstant = Symbol;

type _TokenType = {
  [key: string]: TokenTypeConstant;
};

export const TokenType: _TokenType = {
  LEFT_PAREN: Symbol("LEFT_PAREN"),
  RIGHT_PAREN: Symbol("RIGHT_PAREN"),
  LEFT_BRACE: Symbol("LEFT_BRACE"),
  RIGHT_BRACE: Symbol("RIGHT_BRACE"),
  COMMA: Symbol("COMMA"),
  DOT: Symbol("DOT"),
  MINUS: Symbol("MINUS"),
  PLUS: Symbol("PLUS"),
  SEMICOLON: Symbol("SEMICOLON"),
  SLASH: Symbol("SLASH"),
  STAR: Symbol("STAR"),

  // One or two character tokens.
  BANG: Symbol("BANG"),
  BANG_EQUAL: Symbol("BANG_EQUAL"),
  EQUAL: Symbol("EQUAL"),
  EQUAL_EQUAL: Symbol("EQUAL_EQUAL"),
  GREATER: Symbol("GREATER"),
  GREATER_EQUAL: Symbol("GREATER_EQUAL"),
  LESS: Symbol("LESS"),
  LESS_EQUAL: Symbol("LESS_EQUAL"),
  IDENTIFIER: Symbol("IDENTIFIER"),
  STRING: Symbol("STRING"),
  NUMBER: Symbol("NUMBER"),

  // Keywords.
  AND: Symbol("AND"),
  CLASS: Symbol("CLASS"),
  ELSE: Symbol("ELSE"),
  FALSE: Symbol("FALSE"),
  FUN: Symbol("FUN"),
  FOR: Symbol("FOR"),
  IF: Symbol("IF"),
  NIL: Symbol("NIL"),
  OR: Symbol("OR"),
  PRINT: Symbol("PRINT"),
  RETURN: Symbol("RETURN"),
  SUPER: Symbol("SUPER"),
  THIS: Symbol("THIS"),
  TRUE: Symbol("TRUE"),
  VAR: Symbol("VAR"),
  WHILE: Symbol("WHILE"),
  EOF: Symbol("EOF"),
};

type _TokenLiterals = {
  [key: string]: TokenTypeConstant;
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

type _ReservedKeywords = {
  [key: string]: TokenTypeConstant;
};

export const ReservedKeywords: _ReservedKeywords = {
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

export class Token {
  type: TokenTypeConstant;
  lexeme: string;
  literal: string | number;
  line: number;

  constructor(type: TokenTypeConstant, lexeme: string, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;

    // TODO: Conditionally calculate literal
    this.literal = "";
  }
}

class ScanningError {
  message: string;
  line: number;

  constructor(message: string, line: number) {
    this.message = message;
    this.line = line;
  }
}

const digits = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

function isDigit(char: string) {
  return digits.has(char);
}

const alphas = new Set([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
]);

function isAlpha(char: string) {
  if (!char) {
    return false;
  }

  return char === "_" || alphas.has(char) || alphas.has(char.toLowerCase());
}

export class Scanner {
  source: string;

  #start: number = 0;
  #current: number = 0;
  #line: number = 1;

  #tokens: Token[] = [];
  errors: any[] = [];

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
      this.#scanString();
    } else {
      if (isDigit(c)) {
        this.#scanNumber();
      } else if (isAlpha(c)) {
        this.#scanIdentifier();
      }
      // If the character can't be handled by the above logic, it must be unexpected
      this.#addError("Unexpected char");
    }
  }

  #scanString() {
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
    this.#addToken(TokenType.STRING);
  }

  #scanNumber() {
    while (isDigit(this.#peek())) {
      this.#advance();
    }

    if (this.#peek() === "." && isDigit(this.#peekNext())) {
      this.#advance();
      while (isDigit(this.#peek())) {
        this.#advance();
      }
    }

    this.#addToken(TokenType.NUMBER);
  }

  #scanIdentifier() {
    while (isAlpha(this.#peek())) {
      this.#advance();
    }

    const text = this.source.slice(this.#start, this.#current);
    let tokenType = TokenType.IDENTIFIER;
    if (text in ReservedKeywords) {
      tokenType = ReservedKeywords[text];
    }
    this.#addToken(tokenType);
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

  #peekNext(): string | undefined {
    if (this.#current + 1 >= this.source.length) {
      return;
    }

    return this.source[this.#current + 1];
  }

  #addToken(tokenType: TokenTypeConstant): void {
    const lexeme = this.source.slice(this.#start, this.#current);
    this.#start = this.#current;
    this.#tokens.push(new Token(tokenType, lexeme, this.#line));
  }

  #addError(message: string) {
    this.errors.push(new ScanningError(message, this.#line));
  }
}