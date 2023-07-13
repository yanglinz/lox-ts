import { LoxClass } from "./Callable";
import { RuntimeError } from "./Errors";
import { ExprLiteralValue } from "./Expr";
import { Token } from "./Scanner";

export class LoxClassInstance {
  private klass: LoxClass;
  private fields: Map<string, ExprLiteralValue>;

  constructor(klass: LoxClass) {
    this.klass = klass;
    this.fields = new Map();
  }

  get(name: Token) {
    if (this.fields.has(name.lexeme)) {
      return this.fields.get(name.lexeme);
    }

    const method = this.klass.findMethod(name.lexeme);
    if (method) {
      return method;
    }

    throw new RuntimeError(`Undefined property ${name.lexeme}.`);
  }

  set(name: Token, value: ExprLiteralValue) {
    this.fields.set(name.lexeme, value);
  }

  toString(): string {
    return this.klass.name + " instance";
  }
}
