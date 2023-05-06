import * as fs from "fs/promises";
import { LoxInstance } from "./Instance";
import { Scanner } from "./Scanner";
import { Parser } from "./Parser";
import { Interpreter } from "./Interpreter";

export class Lox {
  async runFile(filePath: string): Promise<void> {
    const contents = await fs.readFile(filePath, "utf8");
    this.run(contents.toString());
  }

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
