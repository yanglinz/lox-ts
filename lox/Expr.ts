import { Token } from "./Scanner";
import { Visitor, VisitorOutput } from "./Visitor";

export class Expr {
  accept(_: Visitor): VisitorOutput {}
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

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitExprBinary(this);
  }
}

export class ExprGrouping extends Expr {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept(visitor: Visitor): VisitorOutput {
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

  accept(visitor: Visitor): VisitorOutput {
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

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitExprUnary(this);
  }
}
