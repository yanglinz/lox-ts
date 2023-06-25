import { Token, TokenType } from "./Scanner";

export class LoggerInterface {
  messages: string[];

  constructor() {
    this.messages = [];
  }

  log(message: string): void {
    throw new Error("NotImplementedError");
  }

  error(message: string): void {
    throw new Error("NotImplementedError");
  }
}

export class ConsoleLogger extends LoggerInterface {
  log(message: string) {
    console.log("lox >", message);
  }

  error(message: string) {
    console.error("lox >", message);
  }
}

export class RecordedLogger extends LoggerInterface {
  log(message: string) {
    this.messages.push(message);
  }

  error(message: string) {
    this.messages.push(message);
  }
}

export class NoopLogger extends LoggerInterface {
  log(_: string) {}

  error(_: string) {}
}

export class LoxInstance {
  logger: LoggerInterface;
  errors: Error[];

  constructor(logger?: LoggerInterface) {
    this.logger = logger ? logger : new ConsoleLogger();
    this.errors = [];
  }

  get hadError() {
    return this.errors.length !== 0;
  }

  error(token: Token, error: Error) {
    this.errors.push(error);

    if (token.type == TokenType.EOF) {
      this.logger.log(`${token.line} at end ${error.message}`);
    } else {
      this.logger.log(`${token.line} at ' ${token.lexeme} ' ${error.message}`);
    }
  }
}
