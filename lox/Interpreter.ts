import * as ast from "./Ast";
import { TokenType } from './Scanner';

// TODO: Does returning a ast.ExprLiteralValue make sense here?

type TODO = any;

export class Interpreter extends ast.Visitor {
  evaluate(expr: ast.Expr): ast.ExprLiteralValue {
    return expr.accept(this);
  }

  isTruthy(object: TODO): boolean {
    if (object == null) return false;
    if (typeof object === 'boolean') return object;
    return true;
  }

  visitExprBinary(expr: ast.ExprBinary): ast.ExprLiteralValue {
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
      if (typeof left === 'number' && typeof right === 'number') {
        return left + right;
      }
      else if (typeof left === 'string' && typeof right === 'string') {
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
    }

    // Unreachable
    return null;
  }

  visitExprGrouping(expr: ast.ExprGrouping): ast.ExprLiteralValue {
    return this.evaluate(expr.expression);
  }

  visitExprLiteral(expr: ast.ExprLiteral): ast.ExprLiteralValue {
    return expr.value
  }

  visitExprUnary(expr: ast.ExprUnary): ast.ExprLiteralValue {
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
