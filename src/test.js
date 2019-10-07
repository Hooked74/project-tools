process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";
process.env.PUBLIC_URL = "";

require("./config/env");

const jest = require("jest");
const { execSync } = require("child_process");
const { isInGitRepository, isInMercurialRepository } = require("./utils/repository");
const createJestConfig = require("./utils/jest-config");
const path = require("path");
const resolve = require("resolve");
const { appSrc } = require("./config/paths");

const argv = process.argv.slice(2);
const cleanArgv = [];
let env = "jsdom";
let resolvedEnv;
let next;

function resolveJestDefaultEnvironment(name) {
  const jestDir = path.dirname(
    resolve.sync("jest", {
      basedir: __dirname
    })
  );
  const jestCLIDir = path.dirname(
    resolve.sync("jest-cli", {
      basedir: jestDir
    })
  );
  const jestConfigDir = path.dirname(
    resolve.sync("jest-config", {
      basedir: jestCLIDir
    })
  );
  return resolve.sync(name, {
    basedir: jestConfigDir
  });
}

process.on("unhandledRejection", err => {
  throw err;
});

if (
  !process.env.CI &&
  argv.indexOf("--watchAll") === -1 &&
  argv.indexOf("--watchAll=false") === -1
) {
  argv.push(isInGitRepository() || isInMercurialRepository() ? "--watch" : "--watchAll");
}

argv.push(
  "--config",
  JSON.stringify(
    createJestConfig(
      relativePath => path.resolve(__dirname, "..", relativePath),
      path.resolve(appSrc, "..")
    )
  )
);

do {
  next = argv.shift();
  if (next === "--env") {
    env = argv.shift();
  } else if (next.indexOf("--env=") === 0) {
    env = next.substring("--env=".length);
  } else {
    cleanArgv.push(next);
  }
} while (argv.length > 0);

argv = cleanArgv;

try {
  resolvedEnv =
    resolveJestDefaultEnvironment(`jest-environment-${env}`) || resolveJestDefaultEnvironment(env);
} catch (e) {
  // ignore
}

const testEnvironment = resolvedEnv || env;

argv.push("--env", testEnvironment);
jest.run(argv);
