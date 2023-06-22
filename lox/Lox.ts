import { LoggerInterface, LoxInstance } from "./Instance";
import { Interpreter } from "./Interpreter";
import { Parser } from "./Parser";
import { Resolver } from "./Resolver";
import { Scanner } from "./Scanner";

interface LoxOptions {
  logger: LoggerInterface;
}

export class Lox {
  logger?: LoggerInterface;

  constructor(options: Partial<LoxOptions> = {}) {
    this.logger = options.logger;
  }

  run(source: string) {
    const lox = new LoxInstance(this.logger);
    try {
      const scanner = new Scanner(lox, source);
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
      this.logger?.error(err);
      return { lox };
    }
  }
}
