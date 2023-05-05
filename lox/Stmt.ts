import { Token } from "./Scanner";

type VisitorOutput = any;

export class StmtVisitor {
  visitExprBinary(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitExprGrouping(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitExprLiteral(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }

  visitExprUnary(_: Stmt): VisitorOutput {
    throw new Error("NotImplementedError");
  }
}

export class Stmt {
  accept(_: StmtVisitor): VisitorOutput {}
}
