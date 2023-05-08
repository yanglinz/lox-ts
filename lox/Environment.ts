import { Token } from "./Scanner";
import { RuntimeError } from "./Errors";

type VariableValue = any;

export class Environment {
  values: Map<string, VariableValue>;

  constructor() {
    this.values = new Map();
  }

  define(name: string, value: VariableValue) {
    this.values.set(name, value);
  }

  get(name: Token) {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    throw new RuntimeError("Undefined variable '" + name.lexeme + "'.");
  }
}
