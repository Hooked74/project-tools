const { existsSync } = require("fs");
const path = require("path");
const { appSrc, appPath, appTsConfig, appJsConfig, appNodeModules } = require("./paths");
const resolve = require("resolve");

function getAdditionalModulePaths(options = {}) {
  const baseUrl = options.baseUrl;
  const baseUrlResolved = path.resolve(appPath, baseUrl);

  if (baseUrl == null) {
    const nodePath = process.env.NODE_PATH || "";
    return nodePath.split(path.delimiter).filter(Boolean);
  }

  if (path.relative(appNodeModules, baseUrlResolved) === "") return null;
  if (path.relative(appSrc, baseUrlResolved) === "") return [appSrc];
  if (path.relative(appPath, baseUrlResolved) === "") return null;

  throw new Error(
    chalk.red.bold(
      "Your project's `baseUrl` can only be set to `src` or `node_modules`." +
        " Create React App does not support other values at this time."
    )
  );
}

function getJestAliases(options = {}) {
  const baseUrl = options.baseUrl;
  const baseUrlResolved = path.resolve(appPath, baseUrl);

  if (!baseUrl) return {};

  if (path.relative(appPath, baseUrlResolved) === "") {
    return {
      "src/(.*)$": "<rootDir>/src/$1"
    };
  }
}

function getModules() {
  const hasTsConfig = existsSync(appTsConfig);
  const hasJsConfig = existsSync(appJsConfig);

  if (hasTsConfig && hasJsConfig) {
    throw new Error(
      "You have both a tsconfig.json and a jsconfig.json. If you are using TypeScript please remove your jsconfig.json file."
    );
  }

  let config;

  if (hasTsConfig) {
    const ts = require(resolve.sync("typescript", {
      basedir: appNodeModules
    }));
    config = ts.readConfigFile(appTsConfig, ts.sys.readFile).config;
  } else if (hasJsConfig) {
    config = require(appJsConfig);
  }

  config = config || {};
  const options = config.compilerOptions || {};

  return {
    additionalModulePaths: getAdditionalModulePaths(options),
    jestAliases: getJestAliases(options),
    hasTsConfig
  };
}

module.exports = getModules();
