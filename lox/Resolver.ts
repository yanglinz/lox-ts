import { Interpreter } from "./Interpreter";
import { Visitor } from "./Visitor";

import { Expr } from "./Expr";
import { Token } from "./Scanner";
import { Stmt, StmtBlock, StmtVar } from "./Stmt";

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

  private resolveAll(nodes: Expr[] | Stmt[]): void {
    for (let n of nodes) {
      this.resolve(n);
    }
  }

  private declare(name: Token): void {
    if (this.scopes.length === 0) return;
    let scope = this.scopes.at(-1);
    scope.set(name.lexeme, false);
  }

  private define(name: Token): void {
    if (this.scopes.length === 0) return;
    let scope = this.scopes.at(-1);
    scope.set(name.lexeme, true);
  }

  visitBlockStmt(stmt: StmtBlock): void {
    this.beginScope();
    this.resolveAll(stmt.statements);
    this.endScope();
  }

  visitVarStmt(stmt: StmtVar): void {
    this.declare(stmt.name);
    if (stmt.initializer != null) {
      this.resolve(stmt.initializer);
    }
    this.define(stmt.name);
  }
}
