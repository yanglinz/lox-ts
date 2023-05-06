import { LoxInstance } from "./Instance";
import { Scanner } from "./Scanner";
import { Parser } from "./Parser";
import { Interpreter } from "./Interpreter";

export class Lox {
  run(source: string) {
    try {
      const instance = new LoxInstance();
      const scanner = new Scanner(source);
      const parser = new Parser(scanner.scan());
      const interpreter = new Interpreter();
      interpreter.interpret(parser.parse());
    } catch (err) {
      console.error(err);
    }
  }
}
