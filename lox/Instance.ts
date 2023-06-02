import { Token } from "./Scanner";

class LoggerInterface {
  messages: string[];

  constructor() {
    this.messages = [];
  }

  log(message: string): void {
    throw new Error("NotImplementedError");
  }
}

class ConsoleLogger extends LoggerInterface {
  log(message: string) {
    console.log("lox >", message);
  }
}

export class RecordedLogger extends LoggerInterface {
  log(message: string) {
    this.messages.push(message);
  }
}

export class LoxInstance {
  logger: LoggerInterface;
  errors: string[];

  constructor(logger?: LoggerInterface) {
    this.logger = logger ? logger : new ConsoleLogger();
    this.errors = [];
  }

  error(token: Token, message: string) {
    this.errors.push(message);
  }
}
