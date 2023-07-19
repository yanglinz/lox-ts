import { Expr, ExprVariable } from "./Expr";
import { Token } from "./Scanner";
import { Visitor, VisitorOutput } from "./Visitor";

export class Stmt {
  accept(_: Visitor): VisitorOutput {}
}

export class StmtExpression extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitExpressionStmt(this);
  }
}

export class StmtFunction extends Stmt {
  name: Token;
  params: Token[];
  body: Stmt[];

  constructor(name: Token, params: Token[], body: Stmt[]) {
    super();
    this.name = name;
    this.params = params;
    this.body = body;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitFunctionStmt(this);
  }
}

export class StmtIf extends Stmt {
  condition: Expr;
  thenBranch: Stmt;
  elseBranch: Stmt;

  constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitIfStmt(this);
  }
}

export class StmtPrint extends Stmt {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitPrintStmt(this);
  }
}

export class StmtReturn extends Stmt {
  keyword: Token;
  value: Expr;

  constructor(keyword: Token, value: Expr) {
    super();
    this.keyword = keyword;
    this.value = value;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitReturnStmt(this);
  }
}

export class StmtVar extends Stmt {
  name: Token;
  initializer: Expr;

  constructor(name: Token, initializer: Expr) {
    super();
    this.name = name;
    this.initializer = initializer;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitVarStmt(this);
  }
}

export class StmtWhile extends Stmt {
  condition: Expr;
  body: Stmt;

  constructor(condition: Expr, body: Stmt) {
    super();
    this.condition = condition;
    this.body = body;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitWhileStmt(this);
  }
}

export class StmtBlock extends Stmt {
  statements: Stmt[];

  constructor(statements: Stmt[]) {
    super();
    this.statements = statements;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitBlockStmt(this);
  }
}

export class StmtClass extends Stmt {
  name: Token;
  superclass: ExprVariable | null;
  methods: StmtFunction[];

  constructor(
    name: Token,
    superclass: ExprVariable | null,
    methods: StmtFunction[]
  ) {
    super();
    this.name = name;
    this.superclass = superclass;
    this.methods = methods;
  }

  accept(visitor: Visitor): VisitorOutput {
    return visitor.visitClassStmt(this);
  }
}
