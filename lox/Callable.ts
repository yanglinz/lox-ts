import { Interpreter } from "./Interpreter";
import { Environment } from "./Environment";
import { StmtFunction } from "./Stmt";
import { ReturnValue } from "./Errors";

type TODO = any;

export class LoxCallable {
  constructor() {}

  get arity(): number {
    throw new Error("Not implemented");
  }

  call(interpreter: Interpreter, args: TODO[]): TODO {
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

  call(interpreter: Interpreter, args: TODO[]): TODO {
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
