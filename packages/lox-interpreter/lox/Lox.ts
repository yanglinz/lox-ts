import { Interpreter } from "./Interpreter";
import { Parser } from "./Parser";
import { Resolver } from "./Resolver";
import { Scanner } from "./Scanner";
import { Token, TokenType } from "./Scanner";

export class LoggerInterface {
  print(message: string): void {
    throw new Error("NotImplementedError");
  }

  error(message: string): void {
    throw new Error("NotImplementedError");
  }
}

export class ConsoleLogger extends LoggerInterface {
  print(message: string) {
    console.log("lox >", message);
  }

  error(message: string) {
    console.error("lox >", message);
  }
}

export class NoopLogger extends LoggerInterface {
  print(_: string) {}

  error(_: string) {}
}

export interface StreamError {
  type: "error";
  error: Error;
  token?: Token;
}

export interface StreamPrint {
  type: "print";
  message: string;
}

export class LoxInstance {
  stream: (StreamError | StreamPrint)[];
  logger: LoggerInterface;
  hadError: boolean;

  constructor(logger?: LoggerInterface) {
    this.stream = [];
    this.logger = logger || new ConsoleLogger();
    this.hadError = false;
  }

  get streamError(): StreamError[] {
    return this.stream.filter((s) => s.type === "error") as StreamError[];
  }

  get streamPrint(): StreamPrint[] {
    return this.stream.filter((s) => s.type === "print") as StreamPrint[];
  }

  print(message: string) {
    this.stream.push({ type: "print", message: message });
    this.logger.print(message);
  }

  error(token: Token, error: Error) {
    this.hadError = true;
    this.stream.push({ type: "error", error, token });

    let message = "";
    if (token.type == TokenType.EOF) {
      message = `${token.line} at end ${error.message}`;
    } else {
      message = `${token.line} at ' ${token.lexeme} ' ${error.message}`;
    }
    this.logger.error(message);
  }

  runtimeError(error: Error) {
    this.hadError = true;
    this.stream.push({ type: "error", error });
  }
}

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

      const statements = parser.parse();
      const resolver = new Resolver(lox, interpreter);
      resolver.resolveAll(statements);
      if (lox.hadError) {
        return { lox };
      }

      const value = interpreter.interpret(statements);
      if (lox.hadError) {
        return { lox };
      }

      return { lox, scanner, parser, interpreter, value };
    } catch (err) {
      lox.hadError = true;
      this.logger?.error(err);
      return { lox };
    }
  }
}
