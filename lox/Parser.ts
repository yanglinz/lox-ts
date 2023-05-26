import {
  Expr,
  ExprAssign,
  ExprBinary,
  ExprCall,
  ExprGrouping,
  ExprLiteral,
  ExprLogical,
  ExprUnary,
  ExprVariable,
} from "./Expr";
import { LoxInstance } from "./Instance";
import { Token, TokenType, TokenTypeConstant } from "./Scanner";
import {
  Stmt,
  StmtBlock,
  StmtExpression,
  StmtFunction,
  StmtIf,
  StmtPrint,
  StmtReturn,
  StmtVar,
  StmtWhile,
} from "./Stmt";

export class Parser {
  lox: LoxInstance;
  tokens: Token[];

  private current: number;

  constructor(lox: LoxInstance, tokens: Token[]) {
    this.lox = lox;
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
      if (this.match(TokenType.FUN)) return this.function("function");
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
    if (this.match(TokenType.FOR)) return this.forStatement();
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.PRINT)) return this.printStatement();
    if (this.match(TokenType.RETURN)) return this.returnStatement();
    if (this.match(TokenType.WHILE)) return this.whileStatement();
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

  private forStatement(): Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");

    let initializer;
    if (this.match(TokenType.SEMICOLON)) {
      initializer = null;
    } else if (this.match(TokenType.VAR)) {
      initializer = this.varDeclaration();
    } else {
      initializer = this.expressionStatement();
    }

    let condition = null;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

    let increment = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");

    let body = this.statement();

    if (increment !== null) {
      body = new StmtBlock([body, new StmtExpression(increment)]);
    }

    if (condition == null) condition = new ExprLiteral(true);
    body = new StmtWhile(condition, body);

    if (initializer != null) {
      body = new StmtBlock([initializer, body]);
    }

    return body;
  }

  private ifStatement(): Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.");

    const thenBranch = this.statement();
    let elseBranch = null;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }

    return new StmtIf(condition, thenBranch, elseBranch);
  }

  private whileStatement(): Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
    const body = this.statement();
    return new StmtWhile(condition, body);
  }

  private printStatement(): Stmt {
    let value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new StmtPrint(value);
  }

  private returnStatement(): Stmt {
    let keyword = this.previous();
    let value = null;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
    return new StmtReturn(keyword, value);
  }

  private expressionStatement(): Stmt {
    let value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new StmtExpression(value);
  }

  private function(kind: string): Stmt {
    const name = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);

    this.consume(TokenType.LEFT_PAREN, `Expect '(' after ${kind} name.`);
    let parameters = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (parameters.length >= 255) {
          this.error(this.peek(), "Can't have more than 255 parameters.");
        }

        parameters.push(
          this.consume(TokenType.IDENTIFIER, "Expect parameter name.")
        );
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");
    this.consume(TokenType.LEFT_BRACE, `Expect '{' before ${kind} body.`);

    let body = this.block();
    return new StmtFunction(name, parameters, body);
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
    let expr = this.or();

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

  private or(): Expr {
    let expr = this.and();

    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.and();
      expr = new ExprLogical(expr, operator, right);
    }

    return expr;
  }

  private and(): Expr {
    let expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.equality();
      expr = new ExprLogical(expr, operator, right);
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

    return this.call();
  }

  private call(): Expr {
    let expr = this.primary();

    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  private finishCall(callee: Expr): Expr {
    let args = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length >= 255) {
          this.error(this.peek(), "Can't have more than 255 arguments.");
        }
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    let paren = this.consume(
      TokenType.RIGHT_PAREN,
      "Expect ')' after arguments."
    );

    return new ExprCall(callee, paren, args);
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
