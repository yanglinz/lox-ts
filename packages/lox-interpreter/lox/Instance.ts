import { LoxClass } from "./Callable";

export class LoxClassInstance {
  private klass: LoxClass;

  constructor(klass: LoxClass) {
    this.klass = klass;
  }

  toString(): string {
    return this.klass.name + " instance";
  }
}
