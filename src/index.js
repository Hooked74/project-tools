#!/usr/bin/env node

const program = require("commander");
const pkg = require("../package");

program
  .version(pkg.version)
  .command("size", "add module size to .size-snapshot.json", {
    executableFile: "size"
  })
  .command("types", "add the common.d.ts file to the generated types", {
    executableFile: "types"
  })
  .command("test", "run tests using jest", {
    executableFile: "test"
  })
  .command(
    "chain-commands <cmd1> <cmd2>",
    "start the first npm command and while it's running it execute the second npm command",
    {
      executableFile: "chain-commands"
    }
  )
  .parse(process.argv);
