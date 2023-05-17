import { Interpreter } from "./Interpreter";

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
