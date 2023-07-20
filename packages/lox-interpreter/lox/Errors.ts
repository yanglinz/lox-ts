import { Token } from "./Scanner";

export class ScanError extends Error {}

export class ParseError extends Error {}

export class ResolutionError extends Error {}

export class RuntimeError extends Error {
  token: Token;

  constructor(token: Token, message: string) {
    super(message);
    this.token = token;
  }
}
