import { Token, TokenType, TokenTypeConstant } from "./scanner";
import * as ast from "./ast";

export class Parser {
  tokens: Token[];

  private current: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse(): ast.Expr {
    return this.expression();
  }

  private match(...tokenTypes: TokenTypeConstant[]): boolean {
    for (let t of tokenTypes) {
      if (this.check(t)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  private check(type: TokenTypeConstant): boolean {
    if (this.isAtEnd()) {
      return false;
    }

    return this.peek().type == type;
  }

  private isAtEnd() {
    return this.peek().type == TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private advance() {
    if (this.isAtEnd) {
      this.current += 1;
    }
    return this.previous();
  }

  private expression(): ast.Expr {
    return this.equality();
  }

  private equality(): ast.Expr {
    let expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      let operator = this.previous();
      let right = this.comparison();
      expr = new ast.ExprBinary(expr, operator, right);
    }

    return expr;
  }

  private comparison(): ast.Expr {
    let expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      let operator = this.previous();
      let right = this.term();
      expr = new ast.ExprBinary(expr, operator, right);
    }

    return expr;
  }

  private term(): ast.Expr {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      let operator = this.previous();
      let right = this.factor();
      expr = new ast.ExprBinary(expr, operator, right);
    }

    return expr;
  }

  private factor(): ast.Expr {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      let operator = this.previous();
      let right = this.unary();
      expr = new ast.ExprBinary(expr, operator, right);
    }

    return expr;
  }

  private unary(): ast.Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      let operator = this.previous();
      let right = this.unary();
      return new ast.ExprUnary(operator, right);
    }

    return this.primary();
  }

  private primary(): ast.Expr {
    if (this.match(TokenType.FALSE)) {
      return new ast.ExprLiteral(false);
    } else if (this.match(TokenType.TRUE)) {
      return new ast.ExprLiteral(true);
    } else if (this.match(TokenType.NIL)) {
      return new ast.ExprLiteral(null);
    }
  }
}
