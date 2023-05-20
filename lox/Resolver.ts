import { Interpreter } from "./Interpreter";
import { Visitor } from "./Visitor";

export class Resolver extends Visitor {
  interpreter: Interpreter;

  constructor(interpreter: Interpreter) {
    super();
    this.interpreter = interpreter;
  }
}
