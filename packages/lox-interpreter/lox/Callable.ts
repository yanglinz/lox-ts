import { Environment } from "./Environment";
import { ReturnValue } from "./Errors";
import { ExprLiteralValue } from "./Expr";
import { LoxClassInstance } from "./Instance";
import { Interpreter } from "./Interpreter";
import { StmtFunction } from "./Stmt";

export class LoxCallable {
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
    const environment = new Environment(this.closure);

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

/**
 * Example function to demonstrate native functions
 */
export class GlobalFnClock extends LoxCallable {
  get arity() {
    return 0;
  }

  call(interpreter: Interpreter, args: ExprLiteralValue[]) {
    return Date.now();
  }

  toString() {
    return "<native fn>";
  }
}

export class LoxClass extends LoxCallable {
  name: string;
  methods: Map<string, LoxFunction>;

  constructor(name: string, methods: Map<string, LoxFunction>) {
    super();
    this.name = name;
    this.methods = methods;
  }

  get arity(): number {
    return 0;
  }

  findMethod(name: string): LoxFunction | null {
    if (this.methods.has(name)) {
      return this.methods.get(name);
    }

    return null;
  }

  call(interpreter: Interpreter, args: ExprLiteralValue[]): ExprLiteralValue {
    const instance = new LoxClassInstance(this);
    return instance;
  }

  toString(): string {
    return this.name;
  }
}
