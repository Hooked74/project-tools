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
  .parse(process.argv);
