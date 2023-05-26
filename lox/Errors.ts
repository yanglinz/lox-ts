import { ExprLiteralValue }  from './Expr';

export class RuntimeError extends Error {}

export class ReturnValue extends Error {
  value: ExprLiteralValue;

  constructor(value: ExprLiteralValue) {
    super();
    this.value = value;
  }
}
