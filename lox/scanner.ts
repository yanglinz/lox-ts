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
