import { Expr } from "./Expr";
import { Stmt } from "./Stmt";

export type VisitorOutput = any;

export class Visitor {
  visitExprBinary(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitExprGrouping(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitExprLiteral(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitExprUnary(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitExpressionStmt(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitPrintStmt(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }
}
