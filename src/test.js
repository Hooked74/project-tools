process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";
process.env.PUBLIC_URL = "";

require("./config/env");

const jest = require("jest");
const { execSync } = require("child_process");
const { isInGitRepository, isInMercurialRepository } = require("./utils/repository");
const createJestConfig = require("./config/jest");
const path = require("path");
const resolve = require("resolve");
const { appPath } = require("./config/paths");

const cleanArgv = [];
let argv = process.argv.slice(2);
let env = "jsdom";
let srcDirs = "src";
let tsOriginalDirs = "";
let resolvedEnv;
let next;

function resolveJestDefaultEnvironment(name) {
  const jestDir = path.dirname(
    resolve.sync("jest", {
      basedir: __dirname,
    })
  );
  const jestCLIDir = path.dirname(
    resolve.sync("jest-cli", {
      basedir: jestDir,
    })
  );
  const jestConfigDir = path.dirname(
    resolve.sync("jest-config", {
      basedir: jestCLIDir,
    })
  );
  return resolve.sync(name, {
    basedir: jestConfigDir,
  });
}

process.on("unhandledRejection", (err) => {
  throw err;
});

if (
  !process.env.CI &&
  argv.indexOf("--watchAll") === -1 &&
  argv.indexOf("--watchAll=false") === -1
) {
  argv.push(isInGitRepository() || isInMercurialRepository() ? "--watch" : "--watchAll");
}

do {
  next = argv.shift();
  switch (true) {
    case next === "--env":
      env = argv.shift();
      break;
    case next.indexOf("--env=") === 0:
      env = next.substring("--env=".length);
      break;
    case next === "--dirs":
      srcDirs = argv.shift();
      break;
    case next.indexOf("--dirs=") === 0:
      srcDirs = next.substring("--dirs=".length);
      break;
    case next.indexOf("--ts-original-dirs=") === 0:
      tsOriginalDirs = next.substring("--ts-original-dirs=".length).replace(/,/g, "|");
      break;
    default:
      cleanArgv.push(next);
  }
} while (argv.length > 0);

argv = cleanArgv;

argv.push(
  "--config",
  JSON.stringify(
    createJestConfig(
      (relativePath) => path.resolve(__dirname, relativePath),
      appPath,
      srcDirs,
      tsOriginalDirs
    )
  )
);

try {
  resolvedEnv =
    resolveJestDefaultEnvironment(`jest-environment-${env}`) || resolveJestDefaultEnvironment(env);
} catch (e) {
  // ignore
}

const testEnvironment = resolvedEnv || env;

argv.push("--env", testEnvironment);
jest.run(argv);
