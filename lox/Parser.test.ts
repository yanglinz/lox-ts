import { Scanner } from "./Scanner";
import { Parser } from "./Parser";

function getParsedExpr(source: string): any {
  let tokens = new Scanner(source).scan();
  let parser = new Parser(tokens);
  return parser.parseExpression();
}

describe("Parser should parse expressions", () => {
  test("unary", () => {
    expect(getParsedExpr("-123")).toMatchInlineSnapshot(`
      ExprUnary {
        "operator": Token {
          "lexeme": "-",
          "line": 1,
          "literal": "",
          "type": Symbol(MINUS),
        },
        "right": ExprLiteral {
          "value": 123,
        },
      }
    `);
  });

  test("comparison", () => {
    expect(getParsedExpr("false == false")).toMatchInlineSnapshot(`
      ExprBinary {
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
      }
    `);
  });
});
