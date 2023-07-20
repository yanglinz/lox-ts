import { ParseError } from "./Errors";
import {
  Expr,
  ExprAssign,
  ExprBinary,
  ExprCall,
  ExprGet,
  ExprGrouping,
  ExprLiteral,
  ExprLogical,
  ExprSet,
  ExprSuper,
  ExprThis,
  ExprUnary,
  ExprVariable,
} from "./Expr";
import { LoxInstance } from "./Lox";
import { Token, TokenType, TokenTypeValue } from "./Scanner";
import {
  Stmt,
  StmtBlock,
  StmtClass,
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
    const statements = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
  }

  private match(...tokenTypes: TokenTypeValue[]): boolean {
    for (const t of tokenTypes) {
      if (this.check(t)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  private check(type: TokenTypeValue): boolean {
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

  private consume(type: TokenTypeValue, message: string) {
    if (this.check(type)) {
      return this.advance();
    }

    throw this.error(this.peek(), message);
  }

  private error(token: Token, message: string) {
    this.lox.error(token, new ParseError(message));
    return new ParseError(message);
  }

  /**
   * Statement grammar rules
   * See https://craftinginterpreters.com/appendix-i.html#statements
   */

  private declaration(): Stmt {
    try {
      if (this.match(TokenType.CLASS)) return this.classDeclaration();
      if (this.match(TokenType.FUN)) return this.function("function");
      if (this.match(TokenType.VAR)) return this.varDeclaration();
      return this.statement();
    } catch (error) {
      if (!(error instanceof ParseError)) {
        throw error;
      }
      this.synchronize();
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
    const statements = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }

    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
  }

  private classDeclaration(): Stmt {
    const name = this.consume(TokenType.IDENTIFIER, "Expect class name.");

    let superclass: ExprVariable = null;
    if (this.match(TokenType.LESS)) {
      this.consume(TokenType.IDENTIFIER, "Expect superclass name.");
      superclass = new ExprVariable(this.previous());
    }

    this.consume(TokenType.LEFT_BRACE, "Expect '{' before class body.");

    const methods: StmtFunction[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      methods.push(this.function("method") as StmtFunction);
    }

    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after class body.");

    return new StmtClass(name, superclass, methods);
  }

  private varDeclaration(): Stmt {
    const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");

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
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new StmtPrint(value);
  }

  private returnStatement(): Stmt {
    const keyword = this.previous();
    let value = null;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
    return new StmtReturn(keyword, value);
  }

  private expressionStatement(): Stmt {
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new StmtExpression(value);
  }

  private function(kind: string): Stmt {
    const name = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);

    this.consume(TokenType.LEFT_PAREN, `Expect '(' after ${kind} name.`);
    const parameters = [];
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

    const body = this.block();
    return new StmtFunction(name, parameters, body);
  }

  /**
   * Expression grammar rules
   * See https://craftinginterpreters.com/appendix-i.html#expressions
   */
  private expression(): Expr {
    return this.assignment();
  }

  private assignment(): Expr {
    const expr = this.or();

    if (this.match(TokenType.EQUAL)) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr instanceof ExprVariable) {
        const name = expr.name;
        return new ExprAssign(name, value);
      } else if (expr instanceof ExprGet) {
        const get = expr as ExprGet;
        return new ExprSet(get.object, get.name, value);
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
      const operator = this.previous();
      const right = this.comparison();
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
      const operator = this.previous();
      const right = this.term();
      expr = new ExprBinary(expr, operator, right);
    }

    return expr;
  }

  private term(): Expr {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new ExprBinary(expr, operator, right);
    }

    return expr;
  }

  private factor(): Expr {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new ExprBinary(expr, operator, right);
    }

    return expr;
  }

  private unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new ExprUnary(operator, right);
    }

    return this.call();
  }

  private call(): Expr {
    let expr = this.primary();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.DOT)) {
        const name = this.consume(
          TokenType.IDENTIFIER,
          "Expect property name after '.'."
        );
        expr = new ExprGet(expr, name);
      } else {
        break;
      }
    }

    return expr;
  }

  private finishCall(callee: Expr): Expr {
    const args = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length >= 255) {
          this.error(this.peek(), "Can't have more than 255 arguments.");
        }
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    const paren = this.consume(
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
    } else if (this.match(TokenType.THIS)) {
      return new ExprThis(this.previous());
    } else if (this.match(TokenType.SUPER)) {
      const keyword = this.previous();
      this.consume(TokenType.DOT, "Expect '.' after 'super'.");
      const method = this.consume(
        TokenType.IDENTIFIER,
        "Expect superclass method name."
      );
      return new ExprSuper(keyword, method);
    } else if (this.match(TokenType.IDENTIFIER)) {
      return new ExprVariable(this.previous());
    } else if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new ExprGrouping(expr);
    }
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type == TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }
}
