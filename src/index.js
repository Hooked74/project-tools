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
  .command(
    "storybook <cmd>",
    "start the storybook process and while it's running it execute the npm <cmd>",
    {
      executableFile: "storybook"
    }
  )
  .command("test", "run tests using jest", {
    executableFile: "test"
  })
  .parse(process.argv);
