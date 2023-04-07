import * as ast from "./ast";

// TODO: Create a visitor interface type
class AstPrinter {
  print(expr: ast.Expr) {
    return expr.accept(this);
  }

  visitBinaryExpr(expr: ast.ExprBinary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr: ast.ExprGrouping): string {
    return this.parenthesize("group", expr.expression);
  }

  visitLiteralExpr(expr: ast.ExprLiteral): string {
    if (expr.value == null) return "nil";
    return expr.value.toString();
  }

  visitUnaryExpr(expr: ast.ExprUnary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: ast.Expr[]) {
    let out = `(${name}`;
    for (let e of exprs) {
      out += e.accept(this);
    }
    out += ")";
    return out;
  }
}
