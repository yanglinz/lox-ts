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

interface StreamError {
  type: "error";
  error: Error;
}

interface StreamPrint {
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

  print(message: string) {
    this.stream.push({ type: "print", message: message });
  }

  error(token: Token, error: Error) {
    this.hadError = true;
    this.stream.push({ type: "error", error });

    let message = "";
    if (token.type == TokenType.EOF) {
      message = `${token.line} at end ${error.message}`;
    } else {
      message = `${token.line} at ' ${token.lexeme} ' ${error.message}`;
    }
    this.logger.error(message);
  }
}
