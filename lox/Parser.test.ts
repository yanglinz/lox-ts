import { LoxInstance } from "./Instance";
import { Scanner } from "./Scanner";
import { Parser } from "./Parser";

function getParsedExpr(source: string): any {
  let lox = new LoxInstance();
  let tokens = new Scanner(lox, source).scan();
  let parser = new Parser(lox, tokens);
  return parser.parse();
}

describe("Parser should parse expressions", () => {
  test("unary", () => {
    expect(getParsedExpr("-123;")).toMatchInlineSnapshot(`
      [
        StmtExpression {
          "expression": ExprUnary {
            "operator": Token {
              "lexeme": "-",
              "line": 1,
              "literal": "",
              "type": Symbol(MINUS),
            },
            "right": ExprLiteral {
              "value": 123,
            },
          },
        },
      ]
    `);
  });

  test("comparison", () => {
    expect(getParsedExpr("false == false;")).toMatchInlineSnapshot(`
      [
        StmtExpression {
          "expression": ExprBinary {
            "left": ExprLiteral {
              "value": false,
            },
            "operator": Token {
              "lexeme": "==",
              "line": 1,
              "literal": "",
              "type": Symbol(EQUAL_EQUAL),
            },
            "right": ExprLiteral {
              "value": false,
            },
          },
        },
      ]
    `);
  });
});

describe("Parser should parse statements", () => {
  test("variable", () => {
    expect(getParsedExpr("var a = 123;")).toMatchInlineSnapshot(`
      [
        StmtVar {
          "initializer": ExprLiteral {
            "value": 123,
          },
          "name": Token {
            "lexeme": "a",
            "line": 1,
            "literal": "",
            "type": Symbol(IDENTIFIER),
          },
        },
      ]
    `);
  });

  test("if conditional", () => {
    expect(getParsedExpr("if (true) { print 123; }")).toMatchInlineSnapshot(`
      [
        StmtIf {
          "condition": ExprLiteral {
            "value": true,
          },
          "elseBranch": null,
          "thenBranch": StmtBlock {
            "statements": [
              StmtPrint {
                "expression": ExprLiteral {
                  "value": 123,
                },
              },
            ],
          },
        },
      ]
    `);
  });

  test("logical or", () => {
    expect(getParsedExpr("false or true;")).toMatchInlineSnapshot(`
      [
        StmtExpression {
          "expression": ExprLogical {
            "left": ExprLiteral {
              "value": false,
            },
            "operator": Token {
              "lexeme": "or",
              "line": 1,
              "literal": "",
              "type": Symbol(OR),
            },
            "right": ExprLiteral {
              "value": true,
            },
          },
        },
      ]
    `);
  });

  test("logical and", () => {
    expect(getParsedExpr("true and false;")).toMatchInlineSnapshot(`
      [
        StmtExpression {
          "expression": ExprLogical {
            "left": ExprLiteral {
              "value": true,
            },
            "operator": Token {
              "lexeme": "and",
              "line": 1,
              "literal": "",
              "type": Symbol(AND),
            },
            "right": ExprLiteral {
              "value": false,
            },
          },
        },
      ]
    `);
  });

  test("while loop", () => {
    expect(getParsedExpr("while(true) { print 1; }")).toMatchInlineSnapshot(`
      [
        StmtWhile {
          "body": StmtBlock {
            "statements": [
              StmtPrint {
                "expression": ExprLiteral {
                  "value": 1,
                },
              },
            ],
          },
          "condition": ExprLiteral {
            "value": true,
          },
        },
      ]
    `);
  });
});
