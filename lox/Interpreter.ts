import { LoxCallable, LoxFunction, GlobalFnClock } from "./Callable";
import { Environment } from "./Environment";
import { ReturnValue, RuntimeError } from "./Errors";
import {
  Expr,
  ExprAssign,
  ExprBinary,
  ExprCall,
  ExprGrouping,
  ExprLiteral,
  ExprLiteralValue,
  ExprLogical,
  ExprUnary,
  ExprVariable,
} from "./Expr";
import { LoxInstance } from "./Instance";
import { Token, TokenType } from "./Scanner";
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
import { Visitor } from "./Visitor";

export class Interpreter extends Visitor {
  lox: LoxInstance;
  environment: Environment;
  globals: Environment;
  locals: Map<Expr, number>;

  constructor(lox: LoxInstance) {
    super();
    this.lox = lox;
    this.environment = new Environment();
    this.globals = this.environment;
    this.locals = new Map();

    this.globals.define("clock", new GlobalFnClock());
  }

  interpret(statements: Stmt[]) {
    const lastIndex = statements.length - 1;
    try {
      for (let [i, s] of statements.entries()) {
        if (i === lastIndex) {
          // Return the output of the last statement
          return this.execute(s);
        } else {
          this.execute(s);
        }
      }
    } catch (error) {
      // TODO: Implement RuntimeErrors
      // https://craftinginterpreters.com/evaluating-expressions.html#runtime-errors
    }
  }

  execute(statement: Stmt): ExprLiteralValue {
    return statement.accept(this);
  }

  executeBlock(statements: Stmt[], environment: Environment): void {
    let previous = this.environment;
    try {
      this.environment = environment;
      for (let statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  evaluate(expr: Expr): ExprLiteralValue {
    return expr.accept(this);
  }

  resolve(expr: Expr, depth: number): void {
    this.locals.set(expr, depth);
  }

  isTruthy(object: ExprLiteralValue): boolean {
    if (object == null) return false;
    if (typeof object === "boolean") return object;
    if (typeof object === "number") return !(object === 0);
    return true;
  }

  isEqual(a: ExprLiteralValue, b: ExprLiteralValue): boolean {
    if (a === null && b === null) return true;
    if (a === null) return false;

    return a == b;
  }

  visitExpressionStmt(stmt: StmtExpression): ExprLiteralValue {
    return this.evaluate(stmt.expression);
  }

  visitFunctionStmt(stmt: StmtFunction): void {
    let func = new LoxFunction(stmt, this.environment);
    this.environment.define(stmt.name.lexeme, func);
  }

  visitIfStmt(stmt: StmtIf): void {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch != null) {
      this.execute(stmt.elseBranch);
    }
    return null;
  }

  visitPrintStmt(stmt: StmtPrint): void {
    let value = this.evaluate(stmt.expression);
    // TODO: Implement stringify method
    this.lox.logger.log(value as string);
  }

  visitReturnStmt(stmt: StmtReturn): void {
    let value = null;
    if (stmt.value != null) {
      value = this.evaluate(stmt.value);
    }

    throw new ReturnValue(value);
  }

  visitBlockStmt(stmt: StmtBlock): void {
    this.executeBlock(stmt.statements, new Environment(this.environment));
  }

  visitVarStmt(stmt: StmtVar): void {
    let value = null;
    if (stmt.initializer != null) {
      value = this.evaluate(stmt.initializer);
    }

    this.environment.define(stmt.name.lexeme, value);
  }

  visitWhileStmt(stmt: StmtWhile): void {
    while (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
    }
  }

  visitBinaryExpr(expr: ExprBinary): ExprLiteralValue {
    let right = this.evaluate(expr.right);
    let left = this.evaluate(expr.left);

    let type = expr.operator.type;
    if (type === TokenType.MINUS) {
      return (left as number) - (right as number);
    } else if (type === TokenType.SLASH) {
      return (left as number) / (right as number);
    } else if (type === TokenType.STAR) {
      return (left as number) * (right as number);
    } else if (type === TokenType.PLUS) {
      if (typeof left === "number" && typeof right === "number") {
        return left + right;
      } else if (typeof left === "string" && typeof right === "string") {
        return left + right;
      }
    } else if (type === TokenType.GREATER) {
      return left > right;
    } else if (type === TokenType.GREATER_EQUAL) {
      return left >= right;
    } else if (type === TokenType.LESS) {
      return left < right;
    } else if (type === TokenType.LESS_EQUAL) {
      return left <= right;
    } else if (type === TokenType.BANG_EQUAL) {
      return !this.isEqual(left, right);
    } else if (type === TokenType.EQUAL_EQUAL) {
      return this.isEqual(left, right);
    }

    // Unreachable
    return null;
  }

  visitCallExpr(expr: ExprCall) {
    let callee = this.evaluate(expr.callee);

    let args = [];
    for (let a of expr.args) {
      args.push(this.evaluate(a));
    }

    if (!(callee instanceof LoxCallable)) {
      throw new RuntimeError("Can only call functions and classes.");
    }

    let func = callee as LoxCallable;
    if (args.length != func.arity) {
      throw new RuntimeError(
        `Expected ${func.arity} arguments but got ${args.length}.`
      );
    }

    return func.call(this, args);
  }

  visitGroupingExpr(expr: ExprGrouping): ExprLiteralValue {
    return this.evaluate(expr.expression);
  }

  visitLiteralExpr(expr: ExprLiteral): ExprLiteralValue {
    return expr.value;
  }

  visitLogicalExpr(expr: ExprLogical): ExprLiteralValue {
    const left = this.evaluate(expr.left);

    if (expr.operator.type == TokenType.OR) {
      if (this.isTruthy(left)) return left;
    } else {
      if (!this.isTruthy(left)) return left;
    }

    return this.evaluate(expr.right);
  }

  visitUnaryExpr(expr: ExprUnary): ExprLiteralValue {
    let right = this.evaluate(expr.right);

    let type = expr.operator.type;
    if (type === TokenType.MINUS) {
      return -1 * (right as number);
    } else if (type === TokenType.BANG) {
      return !this.isTruthy(right);
    }

    // Unreachable
    return null;
  }

  visitVariableExpr(expr: ExprVariable): ExprLiteralValue {
    return this.lookUpVariable(expr.name, expr);
  }

  private lookUpVariable(name: Token, expr: Expr): ExprLiteralValue {
    const distance = this.locals.get(expr);
    if (distance != null) {
      return this.environment.getAt(distance, name.lexeme);
    } else {
      return this.globals.get(name);
    }
  }

  visitAssignExpr(expr: ExprAssign): ExprLiteralValue {
    let value = this.evaluate(expr.value);

    const distance = this.locals.get(expr);
    if (distance != null) {
      this.environment.assignAt(distance, expr.name, value);
    } else {
      this.globals.assign(expr.name, value);
    }

    return value;
  }
}
