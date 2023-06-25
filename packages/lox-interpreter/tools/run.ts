import { Lox } from "../lox/Lox";
import * as fs from "fs/promises";
import * as path from "path";

function fileExists(filePath: string): Promise<boolean> {
  return fs
    .access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

async function runFile() {
  // This script naively assumes that it's invoked via `ts-node tools/run.ts [file-path]`
  let filePath = process.argv[2];
  if (!filePath) {
    console.error("run.ts expects a file path as an argument");
    process.exit(1);
  }

  // Check if file path is absolute or relative
  if (!path.isAbsolute(filePath)) {
    filePath = path.resolve(process.cwd(), filePath);
  }

  // Check if file path exists
  const exists = await fileExists(filePath);
  if (!exists) {
    console.error(`file ${filePath} does not exist`);
    process.exit(2);
  }

  const source = await fs.readFile(filePath, "utf8");
  const lox = new Lox();
  lox.run(source);
}

runFile();
