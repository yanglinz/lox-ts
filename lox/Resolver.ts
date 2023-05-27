import {
  Expr,
  ExprAssign,
  ExprBinary,
  ExprCall,
  ExprGrouping,
  ExprLogical,
  ExprUnary,
  ExprVariable,
} from "./Expr";
import { LoxInstance } from "./Instance";
import { Interpreter } from "./Interpreter";
import { Token } from "./Scanner";
import {
  Stmt,
  StmtBlock,
  StmtExpression,
  StmtFunction,
  StmtIf,
  StmtPrint,
  StmtReturn,
  StmtVar,
  StmtWhile,
} from "./Stmt";
import { Visitor } from "./Visitor";

type Scope = Map<string, boolean>;

export class Resolver extends Visitor {
  lox: LoxInstance;
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

  resolveAll(nodes: Expr[] | Stmt[]): void {
    for (let n of nodes) {
      this.resolve(n);
    }
  }

  private beginScope(): void {
    this.scopes.push(new Map());
  }

  private endScope(): void {
    this.scopes.pop();
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

  private resolveLocal(expr: Expr, name: Token): void {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name.lexeme)) {
        this.interpreter.resolve(expr, this.scopes.length - 1 - i);
        return;
      }
    }
  }

  private resolveFunction(stmt: StmtFunction): void {
    this.beginScope();
    for (let param of stmt.params) {
      this.declare(param);
      this.define(param);
    }
    this.resolveAll(stmt.body);
    this.endScope();
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

  visitVariableExpr(expr: ExprVariable): void {
    if (this.scopes.length) {
      let scope = this.scopes.at(-1);
      if (scope.get(expr.name.lexeme) === false) {
        this.lox.error("Can't read local variable in its own initializer");
      }
    }

    this.resolveLocal(expr, expr.name);
    return null;
  }

  visitAssignExpr(expr: ExprAssign): void {
    this.resolve(expr.value);
    this.resolveLocal(expr, expr.name);
  }

  visitBinaryExpr(expr: ExprBinary): void {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }

  visitCallExpr(expr: ExprCall): void {
    this.resolve(expr.callee);
    for (let arg of expr.args) {
      this.resolve(arg);
    }
  }

  visitGroupingExpr(expr: ExprGrouping): void {
    this.resolve(expr.expression);
  }

  visitLiteralExpr(): void {
    return null;
  }

  visitLogicalExpr(expr: ExprLogical): void {
    this.resolve(expr.left);
    this.resolve(expr.right);
    return null;
  }

  visitUnaryExpr(expr: ExprUnary): void {
    this.resolve(expr.right);
  }

  visitFunctionStmt(stmt: StmtFunction): void {
    this.declare(stmt.name);
    this.define(stmt.name);
    this.resolveFunction(stmt);
  }

  visitExpressionStmt(stmt: StmtExpression): void {
    this.resolve(stmt.expression);
  }

  visitIfStmt(stmt: StmtIf): void {
    this.resolve(stmt.condition);
    this.resolve(stmt.thenBranch);
    if (stmt.elseBranch != null) this.resolve(stmt.elseBranch);
  }

  visitPrintStmt(stmt: StmtPrint): void {
    this.resolve(stmt.expression);
  }

  visitReturnStmt(stmt: StmtReturn): void {
    if (stmt.value != null) {
      this.resolve(stmt.value);
    }
  }

  visitWhileStmt(stmt: StmtWhile): void {
    this.resolve(stmt.condition);
    this.resolve(stmt.body);
  }
}
