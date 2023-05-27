import { LoxInstance } from "./Instance";
import { Interpreter } from "./Interpreter";
import { Parser } from "./Parser";
import { Resolver } from "./Resolver";
import { Scanner } from "./Scanner";

export class Lox {
  run(source: string) {
    try {
      const lox = new LoxInstance();
      const scanner = new Scanner(lox, source);
      const parser = new Parser(lox, scanner.scan());
      const interpreter = new Interpreter(lox);

      let statements = parser.parse();
      const resolver = new Resolver(interpreter);
      resolver.resolveAll(statements);
      interpreter.interpret(statements);
    } catch (err) {
      console.error(err);
    }
  }
}
