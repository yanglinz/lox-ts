import { LoxInstance } from "./Instance";
import { Token, TokenType, TokenTypeConstant } from "./Scanner";
import {
  Expr,
  ExprAssign,
  ExprBinary,
  ExprGrouping,
  ExprLiteral,
  ExprUnary,
  ExprVariable,
} from "./Expr";
import { Stmt, StmtVar, StmtPrint, StmtExpression, StmtBlock } from "./Stmt";

export class Parser {
  lox: LoxInstance;
  tokens: Token[];

  private current: number;

  constructor(lox: LoxInstance, tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse(): Stmt[] {
    let statements = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
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

  private consume(type: TokenTypeConstant, message: string) {
    if (this.check(type)) {
      return this.advance();
    }

    throw this.error(this.peek(), message);
  }

  private error(token: Token, message: string) {
    // TODO: Finish error handling implementation
    return new Error(message);
  }

  /**
   * Statement grammar rules
   *
   * program   -> statement* EOF ;
   * statement -> exprStmt | printStmt ;
   * exprStmt  -> expression ";" ;
   * printStmt -> "print" expression ";" ;
   *
   */

  private declaration(): Stmt {
    try {
      if (this.match(TokenType.VAR)) return this.varDeclaration();
      return this.statement();
    } catch (error) {
      // TODO: Implement error recovery
      // https://craftinginterpreters.com/statements-and-state.html#parsing-variables
      // synchronize();
      return null;
    }
  }

  private statement(): Stmt {
    if (this.match(TokenType.PRINT)) return this.printStatement();
    if (this.match(TokenType.LEFT_BRACE)) return new StmtBlock(this.block());

    return this.expressionStatement();
  }

  private block(): Stmt[] {
    let statements = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }

    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
  }

  private varDeclaration(): Stmt {
    let name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");

    let initializer = null;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
    return new StmtVar(name, initializer);
  }

  private printStatement(): Stmt {
    let value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new StmtPrint(value);
  }

  private expressionStatement(): Stmt {
    let value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new StmtExpression(value);
  }

  /**
   * Expression grammar rules
   *
   * expression     -> literal | unary | binary | grouping ;
   * literal        -> NUMBER | STRING | "true" | "false" | "nil" ;
   * grouping       -> "(" expression ")" ;
   * unary          -> ( "-" | "!" ) expression ;
   * binary         -> expression operator expression ;
   * operator       -> "==" | "!=" | "<" | "<=" | ">" | ">=" | "+"  | "-"  | "*" | "/" ;
   *
   */
  private expression(): Expr {
    return this.assignment();
  }

  private assignment(): Expr {
    let expr = this.equality();

    if (this.match(TokenType.EQUAL)) {
      let equals = this.previous();
      let value = this.assignment();

      if (expr instanceof ExprVariable) {
        let name = expr.name;
        return new ExprAssign(name, value);
      }

      this.error(equals, "Invalid assignment target.");
    }

    return expr;
  }

  private equality(): Expr {
    let expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      let operator = this.previous();
      let right = this.comparison();
      expr = new ExprBinary(expr, operator, right);
    }

    return expr;
  }

  private comparison(): Expr {
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
      expr = new ExprBinary(expr, operator, right);
    }

    return expr;
  }

  private term(): Expr {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      let operator = this.previous();
      let right = this.factor();
      expr = new ExprBinary(expr, operator, right);
    }

    return expr;
  }

  private factor(): Expr {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      let operator = this.previous();
      let right = this.unary();
      expr = new ExprBinary(expr, operator, right);
    }

    return expr;
  }

  private unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      let operator = this.previous();
      let right = this.unary();
      return new ExprUnary(operator, right);
    }

    return this.primary();
  }

  private primary(): Expr {
    if (this.match(TokenType.FALSE)) {
      return new ExprLiteral(false);
    } else if (this.match(TokenType.TRUE)) {
      return new ExprLiteral(true);
    } else if (this.match(TokenType.NIL)) {
      return new ExprLiteral(null);
    } else if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new ExprLiteral(this.previous().literal);
    } else if (this.match(TokenType.IDENTIFIER)) {
      return new ExprVariable(this.previous());
    } else if (this.match(TokenType.LEFT_PAREN)) {
      let expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new ExprGrouping(expr);
    }
  }
}
