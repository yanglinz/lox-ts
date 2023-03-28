import { Token, TokenType } from "./scanner";
import * as ast from "./ast";

export class Parser {
  tokens: Token[];
  current: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse(): ast.Expr {
    return this.#expression();
    // TODO: error handling
  }

  #match(...tokenTypes: number[]): boolean {
    tokenTypes.forEach((t) => {
      if (this.#check(t)) {
        this.#advance();
        return true;
      }
    });

    return false;
  }

  #check(type: number): boolean {
    if (this.#isAtEnd()) {
      return false;
    }

    return this.#peek().type == type;
  }

  #isAtEnd() {
    return this.#peek().type == TokenType.EOF;
  }

  #peek(): Token {
    return this.tokens[this.current];
  }

  #previous(): Token {
    return this.tokens[this.current - 1];
  }

  #advance() {
    if (this.#isAtEnd) {
      this.current += 1;
    }
    return this.#previous();
  }

  #expression(): ast.Expr {
    return this.#equality();
  }

  #equality(): ast.Expr {
    let expr = this.#comparison();

    console.log(expr);

    while (this.#match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      let operator = this.#previous();
      let right = this.#comparison();
      expr = new ast.ExprBinary(expr, operator, right);
    }

    return expr;
  }

  #comparison(): ast.Expr {
    // TODO: This is the wrong implementation
    debugger;

    if (this.#match(TokenType.FALSE)) {
      return new ast.ExprLiteral(false);
    }
  }
}
