// This file is generated from tools/generator.ts
// See https://craftinginterpreters.com/representing-code.html#metaprogramming-the-trees

import { Token } from "./scanner";

type TODO = any;

export class Expr {
  accept(visitor: TODO): TODO {}
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

  accept(visitor: TODO): TODO {
    return visitor.visitExprBinary(this);
  }
}

export class ExprGrouping extends Expr {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept(visitor: TODO): TODO {
    return visitor.visitExprGrouping(this);
  }
}

type ExprLiteralValue = boolean | number | string | null;

export class ExprLiteral extends Expr {
  value: ExprLiteralValue;

  constructor(value: ExprLiteralValue) {
    super();
    this.value = value;
  }

  accept(visitor: TODO): TODO {
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

  accept(visitor: TODO): TODO {
    return visitor.visitExprUnary(this);
  }
}
