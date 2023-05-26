import { Environment } from "./Environment";
import { ReturnValue } from "./Errors";
import { ExprLiteralValue } from "./Expr";
import { Interpreter } from "./Interpreter";
import { StmtFunction } from "./Stmt";

export class LoxCallable {
  constructor() {}

  get arity(): number {
    throw new Error("Not implemented");
  }

  call(interpreter: Interpreter, args: ExprLiteralValue[]): ExprLiteralValue {
    throw new Error("Not implemented");
  }

  toString(): string {
    throw new Error("Not implemented");
  }
}

export class LoxFunction extends LoxCallable {
  declaration: StmtFunction;
  closure: Environment;

  constructor(declaration: StmtFunction, closure: Environment) {
    super();
    this.declaration = declaration;
    this.closure = closure;
  }

  get arity(): number {
    return this.declaration.params.length;
  }

  call(interpreter: Interpreter, args: ExprLiteralValue[]): ExprLiteralValue {
    let environment = new Environment(this.closure);

    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }

    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (e) {
      if (e instanceof ReturnValue) {
        return e.value;
      }
    }

    return null;
  }

  toString(): string {
    return "<fn " + this.declaration.name.lexeme + ">";
  }
}
