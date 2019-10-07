const { existsSync, realpathSync } = require("fs");
const { delimiter, isAbsolute, resolve } = require("path");
const { dotenv } = require("./paths");

delete require.cache[require.resolve("./paths")];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error("The NODE_ENV environment variable is required but was not specified.");
}

const dotenvFiles = [
  `${dotenv}.${NODE_ENV}.local`,
  `${dotenv}.${NODE_ENV}`,
  NODE_ENV !== "test" && `${dotenv}.local`,
  dotenv
].filter(Boolean);

dotenvFiles.forEach(dotenvFile => {
  if (existsSync(dotenvFile)) {
    require("dotenv-expand")(
      require("dotenv").config({
        path: dotenvFile
      })
    );
  }
});

const appDirectory = realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || "")
  .split(delimiter)
  .filter(folder => folder && !isAbsolute(folder))
  .map(folder => resolve(appDirectory, folder))
  .join(delimiter);
