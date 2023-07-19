import { LoxInstance } from "./Lox";
import { Parser } from "./Parser";
import { Scanner } from "./Scanner";
import { Stmt } from "./Stmt";

function getParsedExpr(source: string): Stmt[] {
  const lox = new LoxInstance();
  const tokens = new Scanner(lox, source).scan();
  const parser = new Parser(lox, tokens);
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

  test("for loop", () => {
    expect(getParsedExpr("for (var i = 0; i < 10; i = i + 1) print i;"))
      .toMatchInlineSnapshot(`
      [
        StmtBlock {
          "statements": [
            StmtVar {
              "initializer": ExprLiteral {
                "value": 0,
              },
              "name": Token {
                "lexeme": "i",
                "line": 1,
                "literal": "",
                "type": Symbol(IDENTIFIER),
              },
            },
            StmtWhile {
              "body": StmtBlock {
                "statements": [
                  StmtPrint {
                    "expression": ExprVariable {
                      "name": Token {
                        "lexeme": "i",
                        "line": 1,
                        "literal": "",
                        "type": Symbol(IDENTIFIER),
                      },
                    },
                  },
                  StmtExpression {
                    "expression": ExprAssign {
                      "name": Token {
                        "lexeme": "i",
                        "line": 1,
                        "literal": "",
                        "type": Symbol(IDENTIFIER),
                      },
                      "value": ExprBinary {
                        "left": ExprVariable {
                          "name": Token {
                            "lexeme": "i",
                            "line": 1,
                            "literal": "",
                            "type": Symbol(IDENTIFIER),
                          },
                        },
                        "operator": Token {
                          "lexeme": "+",
                          "line": 1,
                          "literal": "",
                          "type": Symbol(PLUS),
                        },
                        "right": ExprLiteral {
                          "value": 1,
                        },
                      },
                    },
                  },
                ],
              },
              "condition": ExprBinary {
                "left": ExprVariable {
                  "name": Token {
                    "lexeme": "i",
                    "line": 1,
                    "literal": "",
                    "type": Symbol(IDENTIFIER),
                  },
                },
                "operator": Token {
                  "lexeme": "<",
                  "line": 1,
                  "literal": "",
                  "type": Symbol(LESS),
                },
                "right": ExprLiteral {
                  "value": 10,
                },
              },
            },
          ],
        },
      ]
    `);
  });

  test("function call", () => {
    expect(getParsedExpr("hello(1, 2, 3);")).toMatchInlineSnapshot(`
      [
        StmtExpression {
          "expression": ExprCall {
            "args": [
              ExprLiteral {
                "value": 1,
              },
              ExprLiteral {
                "value": 2,
              },
              ExprLiteral {
                "value": 3,
              },
            ],
            "callee": ExprVariable {
              "name": Token {
                "lexeme": "hello",
                "line": 1,
                "literal": "",
                "type": Symbol(IDENTIFIER),
              },
            },
            "paren": Token {
              "lexeme": ")",
              "line": 1,
              "literal": "",
              "type": Symbol(RIGHT_PAREN),
            },
          },
        },
      ]
    `);
  });

  test("function declaration", () => {
    expect(
      getParsedExpr(`
      fun add(a, b, c) {
        print a + b + c;
      }
    `)
    ).toMatchInlineSnapshot(`
      [
        StmtFunction {
          "body": [
            StmtPrint {
              "expression": ExprBinary {
                "left": ExprBinary {
                  "left": ExprVariable {
                    "name": Token {
                      "lexeme": "a",
                      "line": 3,
                      "literal": "",
                      "type": Symbol(IDENTIFIER),
                    },
                  },
                  "operator": Token {
                    "lexeme": "+",
                    "line": 3,
                    "literal": "",
                    "type": Symbol(PLUS),
                  },
                  "right": ExprVariable {
                    "name": Token {
                      "lexeme": "b",
                      "line": 3,
                      "literal": "",
                      "type": Symbol(IDENTIFIER),
                    },
                  },
                },
                "operator": Token {
                  "lexeme": "+",
                  "line": 3,
                  "literal": "",
                  "type": Symbol(PLUS),
                },
                "right": ExprVariable {
                  "name": Token {
                    "lexeme": "c",
                    "line": 3,
                    "literal": "",
                    "type": Symbol(IDENTIFIER),
                  },
                },
              },
            },
          ],
          "name": Token {
            "lexeme": "add",
            "line": 2,
            "literal": "",
            "type": Symbol(IDENTIFIER),
          },
          "params": [
            Token {
              "lexeme": "a",
              "line": 2,
              "literal": "",
              "type": Symbol(IDENTIFIER),
            },
            Token {
              "lexeme": "b",
              "line": 2,
              "literal": "",
              "type": Symbol(IDENTIFIER),
            },
            Token {
              "lexeme": "c",
              "line": 2,
              "literal": "",
              "type": Symbol(IDENTIFIER),
            },
          ],
        },
      ]
    `);
  });

  test("class declaration", () => {
    expect(
      getParsedExpr(`
        class Vehicle {}
    `)
    ).toMatchInlineSnapshot(`
      [
        StmtClass {
          "methods": [],
          "name": Token {
            "lexeme": "Vehicle",
            "line": 2,
            "literal": "",
            "type": Symbol(IDENTIFIER),
          },
          "superclass": null,
        },
      ]
    `);
  });

  test("class declaration with methods", () => {
    expect(
      getParsedExpr(`
        class Vehicle {
          drive() {
            print "Driving!";
          }

          honk() {
            print "Beep!";
          }
        }
    `)
    ).toMatchInlineSnapshot(`
      [
        StmtClass {
          "methods": [
            StmtFunction {
              "body": [
                StmtPrint {
                  "expression": ExprLiteral {
                    "value": "Driving!",
                  },
                },
              ],
              "name": Token {
                "lexeme": "drive",
                "line": 3,
                "literal": "",
                "type": Symbol(IDENTIFIER),
              },
              "params": [],
            },
            StmtFunction {
              "body": [
                StmtPrint {
                  "expression": ExprLiteral {
                    "value": "Beep!",
                  },
                },
              ],
              "name": Token {
                "lexeme": "honk",
                "line": 7,
                "literal": "",
                "type": Symbol(IDENTIFIER),
              },
              "params": [],
            },
          ],
          "name": Token {
            "lexeme": "Vehicle",
            "line": 2,
            "literal": "",
            "type": Symbol(IDENTIFIER),
          },
          "superclass": null,
        },
      ]
    `);
  });
});
