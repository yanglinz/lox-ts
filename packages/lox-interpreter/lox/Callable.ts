import { Environment } from "./Environment";
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

export class ReturnValue extends Error {
  value: ExprLiteralValue;

  constructor(value: ExprLiteralValue) {
    super();
    this.value = value;
  }
}

export class LoxFunction extends LoxCallable {
  declaration: StmtFunction;
  closure: Environment;
  isInitializer: boolean;

  constructor(
    declaration: StmtFunction,
    closure: Environment,
    isInitializer: boolean
  ) {
    super();
    this.declaration = declaration;
    this.closure = closure;
    this.isInitializer = isInitializer;
  }

  get arity(): number {
    return this.declaration.params.length;
  }

  bind(instance: LoxClassInstance): LoxFunction {
    const environment = new Environment(this.closure);
    environment.define("this", instance);
    return new LoxFunction(this.declaration, environment, this.isInitializer);
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
        if (this.isInitializer) return this.closure.getAt(0, "this");
        return e.value;
      } else {
        throw e;
      }
    }

    if (this.isInitializer) {
      return this.closure.getAt(0, "this");
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
  superclass: LoxClass | null;
  methods: Map<string, LoxFunction>;

  constructor(
    name: string,
    superclass: LoxClass | null,
    methods: Map<string, LoxFunction>
  ) {
    super();
    this.name = name;
    this.superclass = superclass;
    this.methods = methods;
  }

  get arity(): number {
    const initializer: LoxFunction = this.findMethod("init");
    if (!initializer) {
      return 0;
    }

    return initializer.arity;
  }

  findMethod(name: string): LoxFunction | null {
    if (this.methods.has(name)) {
      return this.methods.get(name);
    }

    if (this.superclass) {
      return this.superclass.findMethod(name);
    }

    return null;
  }

  call(interpreter: Interpreter, args: ExprLiteralValue[]): ExprLiteralValue {
    const instance = new LoxClassInstance(this);
    const initializer: LoxFunction = this.findMethod("init");
    if (initializer !== null) {
      initializer.bind(instance).call(interpreter, args);
    }

    return instance;
  }

  toString(): string {
    return this.name;
  }
}
