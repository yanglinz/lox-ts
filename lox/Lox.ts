import { LoxInstance } from "./Instance";
import { Scanner } from "./Scanner";
import { Parser } from "./Parser";
import { Interpreter } from "./Interpreter";

export class Lox {
  run(source: string) {
    try {
      const lox = new LoxInstance();
      const scanner = new Scanner(lox, source);
      const parser = new Parser(lox, scanner.scan());
      const interpreter = new Interpreter(lox);
      interpreter.interpret(parser.parse());
    } catch (err) {
      console.error(err);
    }
  }
}
