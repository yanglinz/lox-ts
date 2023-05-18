type TODO = any;

export class RuntimeError extends Error {}

export class ReturnValue extends Error {
  value: TODO;

  constructor(value: TODO) {
    super();
    this.value = value;
  }
}
