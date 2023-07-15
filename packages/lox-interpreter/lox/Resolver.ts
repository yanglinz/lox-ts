import { RuntimeError } from "./Errors";
import {
  Expr,
  ExprAssign,
  ExprBinary,
  ExprCall,
  ExprGet,
  ExprGrouping,
  ExprLogical,
  ExprSet,
  ExprSuper,
  ExprThis,
  ExprUnary,
  ExprVariable,
} from "./Expr";
import { Interpreter } from "./Interpreter";
import { LoxInstance } from "./Lox";
import { Token } from "./Scanner";
import {
  Stmt,
  StmtBlock,
  StmtClass,
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

type FunctionKind = symbol;

type _FunctionType = {
  [key: string]: FunctionKind;
};

const FunctionType: _FunctionType = {
  NONE: Symbol("NONE"),
  FUNCTION: Symbol("FUNCTION"),
  INITIALIZER: Symbol("INITIALIZER"),
  METHOD: Symbol("METHOD"),
};

type ClassKind = symbol;

type _ClassType = {
  [key: string]: ClassKind;
};

const ClassType: _ClassType = {
  NONE: Symbol("NONE"),
  CLASS: Symbol("CLASS"),
};

export class Resolver extends Visitor {
  lox: LoxInstance;
  interpreter: Interpreter;
  scopes: Scope[];
  currentFunction: FunctionKind;
  currentClass: ClassKind;

  constructor(lox: LoxInstance, interpreter: Interpreter) {
    super();
    this.lox = lox;
    this.interpreter = interpreter;
    this.scopes = [];
    this.currentFunction = FunctionType.NONE;
    this.currentClass = ClassType.NONE;
  }

  resolve(node: Expr | Stmt): void {
    node.accept(this);
  }

  resolveAll(nodes: Expr[] | Stmt[]): void {
    for (const n of nodes) {
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
    const scope = this.scopes.at(-1);
    scope.set(name.lexeme, false);
  }

  private define(name: Token): void {
    if (this.scopes.length === 0) return;
    const scope = this.scopes.at(-1);
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

  private resolveFunction(
    stmt: StmtFunction,
    functionType: FunctionKind = FunctionType.FUNCTION
  ): void {
    const enclosingFunction = this.currentFunction;
    this.currentFunction = functionType;

    this.beginScope();
    for (const param of stmt.params) {
      this.declare(param);
      this.define(param);
    }
    this.resolveAll(stmt.body);
    this.endScope();

    this.currentFunction = enclosingFunction;
  }

  visitBlockStmt(stmt: StmtBlock): void {
    this.beginScope();
    this.resolveAll(stmt.statements);
    this.endScope();
  }

  visitClassStmt(stmt: StmtClass): void {
    const enclosingClass = this.currentClass;
    this.currentClass = ClassType.CLASS;

    this.declare(stmt.name);
    this.define(stmt.name);

    if (stmt.superclass) {
      if (stmt.name.lexeme === stmt.superclass.name.lexeme) {
        this.lox.error(
          stmt.superclass.name,
          new RuntimeError("A class can't inherit from itself.")
        );
      }

      this.resolve(stmt.superclass);
    }

    if (stmt.superclass) {
      this.beginScope();
      this.scopes.at(-1).set("super", true);
    }

    this.beginScope();

    const scope = this.scopes.at(-1);
    scope.set("this", true);

    for (let method of stmt.methods) {
      let declaration = FunctionType.METHOD;
      if (method.name.lexeme === "init") {
        declaration = FunctionType.INITIALIZER;
      }

      this.resolveFunction(method, declaration);
    }

    if (stmt.superclass) {
      this.endScope();
    }

    this.currentClass = enclosingClass;
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
      const scope = this.scopes.at(-1);
      if (scope.get(expr.name.lexeme) === false) {
        this.lox.error(
          expr.name,
          new RuntimeError("Can't read local variable in its own initializer")
        );
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
    for (const arg of expr.args) {
      this.resolve(arg);
    }
  }

  visitGetExpr(expr: ExprGet): void {
    this.resolve(expr.object);
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
  }

  visitSetExpr(expr: ExprSet): void {
    this.resolve(expr.value);
    this.resolve(expr.object);
  }

  visitSuperExpr(expr: ExprSuper): void {
    this.resolveLocal(expr, expr.keyword);
  }

  visitThisExpr(expr: ExprThis): void {
    if (this.currentClass === ClassType.NONE) {
      this.lox.error(
        expr.keyword,
        new RuntimeError("Can't use 'this' outside of a class.")
      );
      return null;
    }

    this.resolveLocal(expr, expr.keyword);
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
      if (this.currentFunction === FunctionType.INITIALIZER) {
        this.lox.error(
          stmt.keyword,
          new RuntimeError("Can't return a value from an initializer.")
        );
      }

      this.resolve(stmt.value);
    }
  }

  visitWhileStmt(stmt: StmtWhile): void {
    this.resolve(stmt.condition);
    this.resolve(stmt.body);
  }
}
