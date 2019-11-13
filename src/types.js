const chalk = require("chalk");
const { error } = require("simple-output");
const log = require("./utils/log");
const { promisify } = require("util");
const { resolve } = require("path");
const { readFileSync, writeFile } = require("fs");
const execAsync = promisify(require("child_process").exec);
const execSync = require("child_process").execSync;
const writeFileAsync = promisify(writeFile);

(async function main() {
  try {
    await Promise.all([
      log(() =>
        execAsync(
          `${resolve("node_modules/typescript/bin/tsc")} --project tsconfig.types.json`
        ).then(() => "Typescript definitions created")
      ),
      log(() =>
        writeFileAsync(
          resolve("dist/common.d.ts"),
          readFileSync(resolve("src/common.d.ts"))
            .toString()
            .split("\n")
            .filter(s => s && !s.includes('types="react-scripts"'))
            .join("\n")
        ).then(() => "Common definitions created")
      )
    ]);

    const indexdtsPath = resolve("dist/index.d.ts");
    log(() =>
      writeFileAsync(
        indexdtsPath,
        `/// <reference path="common.d.ts" />\n\n${readFileSync(indexdtsPath).toString()}`
      ).then(() => `Overwritten ${chalk.cyan(indexdtsPath)}`)
    );

    log(() =>
      writeFileAsync(
        resolve("dist/tsconfig.json"),
        JSON.stringify(
          {
            extends: "../tsconfig.json",
            include: ["*.d.ts"],
            compilerOptions: {
              typeRoots: [
                "node_modules/@types",
                "../node_modules/@types",
                "../../@types",
                "../../../@types",
                "node_modules/@h74-types",
                "../node_modules/@h74-types",
                "../../@h74-types",
                "../../../@h74-types",
                "../typings"
              ]
            }
          },
          null,
          2
        )
      ).then(() => `Generated ${chalk.cyan("tsconfig.json")}`)
    );
  } catch (e) {
    error(e.stdout ? e.stdout.toString() : e);
    process.exit(1);
  }
})();
