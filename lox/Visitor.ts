import { Expr } from "./Expr";
import { Stmt } from "./Stmt";

export type VisitorOutput = any;

export class Visitor {
  visitAssignExpr(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitBinaryExpr(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitGroupingExpr(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitLiteralExpr(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitUnaryExpr(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitVariableExpr(_: Expr): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitExpressionStmt(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitPrintStmt(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitVarStmt(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitBlockStmt(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }
}
