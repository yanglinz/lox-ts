import { Interpreter } from "./Interpreter";
import { Visitor } from "./Visitor";

import { Expr } from "./Expr";
import { Stmt, StmtBlock } from "./Stmt";

type Scope = Map<string, boolean>;

export class Resolver extends Visitor {
  interpreter: Interpreter;
  scopes: Scope[];

  constructor(interpreter: Interpreter) {
    super();
    this.interpreter = interpreter;
    this.scopes = [];
  }

  resolve(node: Expr | Stmt): void {
    node.accept(this);
  }

  private beginScope(): void {
    this.scopes.push(new Map());
  }

  private endScope(): void {
    this.scopes.pop();
  }

  resolveAll(nodes: Expr[] | Stmt[]): void {
    for (let n of nodes) {
      this.resolve(n);
    }
  }

  visitBlockStmt(stmt: StmtBlock): void {
    this.beginScope();
    this.resolveAll(stmt.statements);
    this.endScope();
  }
}
