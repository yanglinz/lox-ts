import { Token } from "./Scanner";

type VisitorOutput = any;

export class ExprVisitor {
  visitExprBinary(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitExprGrouping(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitExprLiteral(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitExprUnary(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }
}

export class Expr {
  accept(_: ExprVisitor): VisitorOutput {}
}

export class ExprBinary extends Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept(visitor: ExprVisitor): VisitorOutput {
    return visitor.visitExprBinary(this);
  }
}

export class ExprGrouping extends Expr {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept(visitor: ExprVisitor): VisitorOutput {
    return visitor.visitExprGrouping(this);
  }
}

export type ExprLiteralValue = boolean | number | string | null;

export class ExprLiteral extends Expr {
  value: ExprLiteralValue;

  constructor(value: ExprLiteralValue) {
    super();
    this.value = value;
  }

  accept(visitor: ExprVisitor): VisitorOutput {
    return visitor.visitExprLiteral(this);
  }
}

export class ExprUnary extends Expr {
  operator: Token;
  right: Expr;

  constructor(operator: Token, right: Expr) {
    super();
    this.operator = operator;
    this.right = right;
  }

  accept(visitor: ExprVisitor): VisitorOutput {
    return visitor.visitExprUnary(this);
  }
}
