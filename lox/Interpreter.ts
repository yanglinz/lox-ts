import { LoxInstance } from "./Instance";
import { Environment } from "./Environment";
import {
  Expr,
  ExprAssign,
  ExprBinary,
  ExprGrouping,
  ExprLiteral,
  ExprLiteralValue,
  ExprUnary,
  ExprVariable,
} from "./Expr";
import { Stmt, StmtExpression, StmtPrint, StmtVar } from "./Stmt";
import { Visitor } from "./Visitor";
import { TokenType } from "./Scanner";

type TODO = any;

export class Interpreter extends Visitor {
  lox: LoxInstance;
  environment: Environment;

  constructor(lox: LoxInstance) {
    super();
    this.lox = lox;
    this.environment = new Environment();
  }

  interpret(statements: Stmt[]) {
    try {
      for (let s of statements) {
        this.execute(s);
      }
    } catch (error) {
      // TODO: Implement RuntimeErrors
      // https://craftinginterpreters.com/evaluating-expressions.html#runtime-errors
    }
  }

  execute(statement: Stmt): ExprLiteralValue {
    return statement.accept(this);
  }

  evaluate(expr: Expr): ExprLiteralValue {
    return expr.accept(this);
  }

  isTruthy(object: TODO): boolean {
    if (object == null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }

  isEqual(a: TODO, b: TODO): boolean {
    if (a === null && b === null) return true;
    if (a === null) return false;

    return a == b;
  }

  visitExpressionStmt(stmt: StmtExpression): void {
    this.evaluate(stmt.expression);
  }

  visitPrintStmt(stmt: StmtPrint): void {
    let value = this.evaluate(stmt.expression);
    // TODO: stringify value
    console.log(value);
  }

  visitVarStmt(stmt: StmtVar): void {
    let value = null;
    if (stmt.initializer != null) {
      value = this.evaluate(stmt.initializer);
    }

    this.environment.define(stmt.name.lexeme, value);
  }

  visitBinaryExpr(expr: ExprBinary): ExprLiteralValue {
    let right: TODO = this.evaluate(expr.right);
    let left: TODO = this.evaluate(expr.left);

    let type = expr.operator.type;
    if (type === TokenType.MINUS) {
      return left - right;
    } else if (type === TokenType.SLASH) {
      return left / right;
    } else if (type === TokenType.STAR) {
      return left * right;
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

  visitGroupingExpr(expr: ExprGrouping): ExprLiteralValue {
    return this.evaluate(expr.expression);
  }

  visitLiteralExpr(expr: ExprLiteral): ExprLiteralValue {
    return expr.value;
  }

  visitUnaryExpr(expr: ExprUnary): ExprLiteralValue {
    let right: TODO = this.evaluate(expr.right);

    let type = expr.operator.type;
    if (type === TokenType.MINUS) {
      return -1 * right;
    } else if (type === TokenType.BANG) {
      return !this.isTruthy(right);
    }

    // Unreachable
    return null;
  }

  visitVariableExpr(expr: ExprVariable): ExprLiteralValue {
    return this.environment.get(expr.name);
  }

  visitAssignExpr(expr: ExprAssign): ExprLiteralValue {
    let value = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value;
  }
}
