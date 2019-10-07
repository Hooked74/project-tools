const { resolve } = require("path");
const { realpathSync, existsSync } = require("fs");
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

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

module.exports = {
  dotenv: resolveApp(".env"),
  appPath: resolveApp("."),
  appSrc: resolveApp("src"),
  appJsConfig: resolveApp("jsconfig.json"),
  appTsConfig: resolveApp("tsconfig.json"),
  appNodeModules: resolveApp("node_modules"),
  appPackageJson: resolveApp("package.json"),
  testsSetup: resolveModule(resolveApp, "src/setupTests"),
  moduleFileExtensions
};
