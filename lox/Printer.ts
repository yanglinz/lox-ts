import { Expr, ExprBinary, ExprGrouping, ExprLiteral, ExprUnary } from "./Expr";
import { Visitor } from "./Visitor";

export class AstPrinter extends Visitor {
  print(expr: Expr): string {
    return expr.accept(this);
  }

  visitBinaryExpr(expr: ExprBinary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr: ExprGrouping): string {
    return this.parenthesize("group", expr.expression);
  }

  visitLiteralExpr(expr: ExprLiteral): string {
    if (expr.value == null) return "nil";
    return expr.value.toString();
  }

  visitUnaryExpr(expr: ExprUnary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: Expr[]) {
    let out = `(${name}`;
    for (const e of exprs) {
      out += ` ${e.accept(this)}`;
    }
    out += ")";
    return out;
  }
}
