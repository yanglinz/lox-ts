import { Expr } from "./Expr";
import { Token } from "./Scanner";
import { Visitor, VisitorOutput } from "./Visitor";

export class Stmt {
  accept(_: Visitor): VisitorOutput {}
}

export class StmtExpression extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitExpressionStmt(this);
  }
}

export class StmtPrint extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitPrintStmt(this);
  }
}

export class StmtVar extends Stmt {
  name: Token;
  initializer: Expr;

  constructor(name: Token, initializer: Expr) {
    super();
    this.name = name;
    this.initializer = initializer;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitVarStmt(this);
  }
}
