const { resolve } = require("path");
const { realpathSync } = require("fs");
const url = require("url");

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx"
];

const appDirectory = realpathSync(process.cwd());
const resolveApp = relativePath => resolve(appDirectory, relativePath);

module.exports = {
  dotenv: resolveApp(".env"),
  appPath: resolveApp("."),
  appSrc: resolveApp("src"),
  appJsConfig: resolveApp("jsconfig.json"),
  appTsConfig: resolveApp("tsconfig.json"),
  appNodeModules: resolveApp("node_modules"),
  appPackageJson: resolveApp("package.json"),
  testsSetup: resolveApp("setupTests.js"),
  moduleFileExtensions
};
