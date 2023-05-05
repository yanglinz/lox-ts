import { Token } from "./Scanner";
import { Expr } from "./Expr";

type VisitorOutput = any;

export class StmtVisitor {
  visitExpressionStmt(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitPrintStmt(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }
}

export class Stmt {
  accept(_: StmtVisitor): VisitorOutput {}
}

export class StmtExpression extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept(visitor: StmtVisitor): VisitorOutput {
    return visitor.visitExpressionStmt(this);
  }
}

export class StmtPrint extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept(visitor: StmtVisitor): VisitorOutput {
    return visitor.visitPrintStmt(this);
  }
}
