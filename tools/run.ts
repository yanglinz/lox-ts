import * as path from "path";
import * as fs from "fs";
import { Lox } from "../lox/Lox";

function runFile() {
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
  if (!fs.existsSync(filePath)) {
    console.error(`file ${filePath} does not exist`);
    process.exit(2);
  }

  console.log(filePath);
}

runFile();
