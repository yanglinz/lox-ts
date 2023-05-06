import { Expr, ExprBinary, ExprGrouping, ExprLiteral, ExprUnary } from "./Expr";
import { Visitor } from "./Visitor";

export class AstPrinter extends Visitor {
  print(expr: Expr): string {
    return expr.accept(this);
  }

  visitExprBinary(expr: ExprBinary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitExprGrouping(expr: ExprGrouping): string {
    return this.parenthesize("group", expr.expression);
  }

  visitExprLiteral(expr: ExprLiteral): string {
    if (expr.value == null) return "nil";
    return expr.value.toString();
  }

  visitExprUnary(expr: ExprUnary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: Expr[]) {
    let out = `(${name}`;
    for (let e of exprs) {
      out += ` ${e.accept(this)}`;
    }
    out += ")";
    return out;
  }
}
