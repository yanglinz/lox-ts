import {
  Expr,
  ExprBinary,
  ExprGrouping,
  ExprLiteral,
  ExprLiteralValue,
  ExprUnary,
  ExprVisitor,
} from "./Expr";
import { TokenType } from "./Scanner";

// TODO: Implement RuntimeErrors
// https://craftinginterpreters.com/evaluating-expressions.html#runtime-errors

type TODO = any;

export class Interpreter extends ExprVisitor {
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

  visitExprBinary(expr: ExprBinary): ExprLiteralValue {
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

  visitExprGrouping(expr: ExprGrouping): ExprLiteralValue {
    return this.evaluate(expr.expression);
  }

  visitExprLiteral(expr: ExprLiteral): ExprLiteralValue {
    return expr.value;
  }

  visitExprUnary(expr: ExprUnary): ExprLiteralValue {
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
}
