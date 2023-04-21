import * as ast from "./Ast";
import { Token, TokenType } from "./Scanner";
import { AstPrinter } from "./Printer";

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
