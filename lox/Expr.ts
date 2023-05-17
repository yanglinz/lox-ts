import { Token } from "./Scanner";
import { Visitor, VisitorOutput } from "./Visitor";
import { LoxCallable } from "./Callable";

export class Expr {
  accept(_: Visitor): VisitorOutput {}
}

export class ExprAssign extends Expr {
  name: Token;
  value: Expr;

  constructor(name: Token, value: Expr) {
    super();
    this.name = name;
    this.value = value;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitAssignExpr(this);
  }
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
    return visitor.visitBinaryExpr(this);
  }
}

export class ExprCall extends Expr {
  callee: Expr;
  paren: Token;
  args: Expr[];

  constructor(callee: Expr, paren: Token, args: Expr[]) {
    super();
    this.callee = callee;
    this.paren = paren;
    this.args = args;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitCallExpr(this);
  }
}

export class ExprGrouping extends Expr {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitGroupingExpr(this);
  }
}

export type ExprLiteralValue = LoxCallable | boolean | number | string | null;

export class ExprLiteral extends Expr {
  value: ExprLiteralValue;

  constructor(value: ExprLiteralValue) {
    super();
    this.value = value;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitLiteralExpr(this);
  }
}

export class ExprLogical extends Expr {
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
    return visitor.visitLogicalExpr(this);
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
    return visitor.visitUnaryExpr(this);
  }
}

export class ExprVariable extends Expr {
  name: Token;

  constructor(name: Token) {
    super();
    this.name = name;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitVariableExpr(this);
  }
}
