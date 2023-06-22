import { LoxInstance } from "./Instance";
import { Interpreter } from "./Interpreter";
import { Parser } from "./Parser";
import { Resolver } from "./Resolver";
import { Scanner } from "./Scanner";

export class Lox {
  run(source: string) {
    const lox = new LoxInstance();
    try {
      const scanner = new Scanner(lox, source);
      debugger;
      if (lox.hadError) {
        return { lox };
      }
      const parser = new Parser(lox, scanner.scan());
      if (lox.hadError) {
        return { lox };
      }
      const interpreter = new Interpreter(lox);
      if (lox.hadError) {
        return { lox };
      }

      let statements = parser.parse();
      const resolver = new Resolver(interpreter);
      resolver.resolveAll(statements);
      interpreter.interpret(statements);
      return { lox, scanner, parser, interpreter };
    } catch (err) {
      console.error(err);
      return { lox };
    }
  }
}
