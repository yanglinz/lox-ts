import * as Path from "path";
import * as fs from "fs/promises";

class Generator {
  outputPath: string;
  asts: string[] = [];
  sources: string[] = [];

  constructor(outputPath: string) {
    this.outputPath = outputPath;
  }

  defineType(className: string, fieldList: string[]) {
    let source = `
class ${className} {
    // Something goes here!
}
`;
    this.sources.push(source);
  }

  defineAst(baseName: string, types: string[]) {
    types.forEach((t) => {
      let className = `${baseName}${t.split(":")[0].trim()}`;
      this.defineType(className, []);
    });
  }

  async write() {
    let contents = `// This file is generated from tools/generator.ts
// See https://craftinginterpreters.com/representing-code.html#metaprogramming-the-trees
`;
    this.sources.forEach((s) => {
      contents += s;
    });
    await fs.writeFile(this.outputPath, contents, { flag: "w" });
  }
}

async function run() {
  let outputPath = Path.join(__dirname, "../lox/expr/index.ts");
  let generator = new Generator(outputPath);

  generator.defineAst("Expr", [
    "Binary   : Expr left, Token operator, Expr right",
    "Grouping : Expr expression",
    "Literal  : Object value",
    "Unary    : Token operator, Expr right",
  ]);

  await generator.write();
}

run();
