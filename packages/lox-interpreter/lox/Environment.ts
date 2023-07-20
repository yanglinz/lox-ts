import { RuntimeError } from "./Errors";
import { ExprLiteralValue } from "./Expr";
import { Token } from "./Scanner";

type VariableValue = ExprLiteralValue;

export class Environment {
  enclosing?: Environment;
  values: Map<string, VariableValue>;

  constructor(enclosing?: Environment) {
    this.enclosing = enclosing;
    this.values = new Map();
  }

  define(name: string, value: VariableValue) {
    this.values.set(name, value);
  }

  ancestor(distance: number): Environment {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let environment: Environment = this;
    for (let i = 0; i < distance; i++) {
      environment = environment.enclosing;
    }

    return environment;
  }

  assign(name: Token, value: VariableValue) {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }

    if (this.enclosing) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }

  assignAt(distance: number, name: Token, value: VariableValue) {
    this.ancestor(distance).values.set(name.lexeme, value);
  }

  get(name: Token): VariableValue {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    if (this.enclosing) return this.enclosing.get(name);

    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }

  getAt(distance: number, name: string): VariableValue {
    return this.ancestor(distance).values.get(name);
  }
}
