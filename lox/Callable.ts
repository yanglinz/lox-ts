import { Interpreter } from "./Interpreter";
import { Environment } from "./Environment";
import { StmtFunction } from "./Stmt";

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

  constructor(declaration: StmtFunction) {
    super();
    this.declaration = declaration;
  }

  get arity(): number {
    return this.declaration.params.length;
  }

  call(interpreter: Interpreter, args: TODO[]): TODO {
    let environment = new Environment(interpreter.globals);

    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }

    interpreter.executeBlock(this.declaration.body, environment);
    return null;
  }

  toString(): string {
    return "<fn " + this.declaration.name.lexeme + ">";
  }
}
