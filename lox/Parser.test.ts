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
});
