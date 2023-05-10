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

  constructor(logger?: LoggerInterface) {
    this.logger = logger ? logger : new ConsoleLogger();
  }
}
