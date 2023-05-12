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

export class StmtIf extends Stmt {
  condition: Expr;
  thenBranch: Stmt;
  elseBranch: Stmt;

  constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitIfStmt(this);
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

export class StmtBlock extends Stmt {
  statements: Stmt[];

  constructor(statements: Stmt[]) {
    super();
    this.statements = statements;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitBlockStmt(this);
  }
}
