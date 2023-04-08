import * as ast from "./ast";

export class AstPrinter extends ast.Visitor {
  print(expr: ast.Expr): string {
    return expr.accept(this);
  }

  visitExprBinary(expr: ast.ExprBinary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitExprGrouping(expr: ast.ExprGrouping): string {
    return this.parenthesize("group", expr.expression);
  }

  visitExprLiteral(expr: ast.ExprLiteral): string {
    if (expr.value == null) return "nil";
    return expr.value.toString();
  }

  visitExprUnary(expr: ast.ExprUnary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: ast.Expr[]) {
    let out = `(${name}`;
    for (let e of exprs) {
      out += ` ${e.accept(this)}`;
    }
    out += ")";
    return out;
  }
}
