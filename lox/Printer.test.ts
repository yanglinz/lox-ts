import * as ast from "./Expr";
import { AstPrinter } from "./Printer";
import { Token, TokenType } from "./Scanner";

describe("AST pretty printer", () => {
  test("print expression", () => {
    let expression = new ast.ExprBinary(
      new ast.ExprUnary(
        new Token(TokenType.MINUS, "-", 1),
        new ast.ExprLiteral(123)
      ),
      new Token(TokenType.STAR, "*", 1),
      new ast.ExprGrouping(new ast.ExprLiteral(45.67))
    );

    let printer = new AstPrinter();
    expect(printer.print(expression)).toEqual("(* (- 123) (group 45.67))");
  });
});
