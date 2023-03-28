// This file is generated from tools/generator.ts
// See https://craftinginterpreters.com/representing-code.html#metaprogramming-the-trees

import { Token } from "./scanner";

export class Expr {}

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
}

export class ExprGrouping extends Expr {
  // Something goes here!
}

export class ExprLiteral extends Expr {
  value: any;

  constructor(value: any) {
    super();
    this.value = value;
  }
}

export class ExprUnary extends Expr {
  // Something goes here!
}
