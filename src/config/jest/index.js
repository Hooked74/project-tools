const { existsSync } = require("fs");
const chalk = require("chalk");
const { testsSetup, moduleFileExtensions, appPackageJson } = require("../paths");
const { additionalModulePaths, jestAliases } = require("../modules");

module.exports = (resolve, rootDir) => {
  const setupTestsMatches = testsSetup.match(/setupTests\.(.+)/);
  const setupTestsFileExtension = (setupTestsMatches && setupTestsMatches[1]) || "js";
  const setupTestsFile = existsSync(testsSetup)
    ? `<rootDir>/setupTests.${setupTestsFileExtension}`
    : undefined;

  const config = {
    roots: ["<rootDir>/src"],
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
    setupFiles: [resolve("config/jest/polyfills")],
    setupFilesAfterEnv: setupTestsFile ? [setupTestsFile] : [],
    testMatch: [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
    ],
    testEnvironment: "jest-environment-jsdom-fifteen",
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": resolve("config/jest/babel-transform.js"),
      "^.+\\.css$": resolve("config/jest/css-transform.js"),
      "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": resolve("config/jest/file-transform.js")
    },
    transformIgnorePatterns: [
      "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
      "^.+\\.module\\.(css|sass|scss)$"
    ],
    modulePaths: additionalModulePaths || [],
    moduleNameMapper: {
      "^react-native$": "react-native-web",
      "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
      ...(jestAliases || {})
    },
    moduleFileExtensions: [...moduleFileExtensions, "node"].filter(ext => !ext.includes("mjs")),
    watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"]
  };
  if (rootDir) {
    config.rootDir = rootDir;
  }
  const overrides = Object.assign({}, require(appPackageJson).jest);
  const supportedKeys = [
    "collectCoverageFrom",
    "coverageReporters",
    "coverageThreshold",
    "coveragePathIgnorePatterns",
    "extraGlobals",
    "globalSetup",
    "globalTeardown",
    "moduleNameMapper",
    "resetMocks",
    "resetModules",
    "snapshotSerializers",
    "transform",
    "transformIgnorePatterns",
    "watchPathIgnorePatterns"
  ];
  if (overrides) {
    supportedKeys.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(overrides, key)) {
        if (Array.isArray(config[key]) || typeof config[key] !== "object") {
          config[key] = overrides[key];
        } else {
          config[key] = Object.assign({}, config[key], overrides[key]);
        }

        delete overrides[key];
      }
    });
    const unsupportedKeys = Object.keys(overrides);
    if (unsupportedKeys.length) {
      const isOverridingSetupFile = unsupportedKeys.indexOf("setupFilesAfterEnv") > -1;

      if (isOverridingSetupFile) {
        console.error(
          chalk.red(
            "We detected " +
              chalk.bold("setupFilesAfterEnv") +
              " in your package.json.\n\n" +
              "Remove it from Jest configuration, and put the initialization code in " +
              chalk.bold("src/setupTests.js") +
              ".\nThis file will be loaded automatically.\n"
          )
        );
      } else {
        console.error(
          chalk.red(
            "\nOut of the box, Create React App only supports overriding " +
              "these Jest options:\n\n" +
              supportedKeys.map(key => chalk.bold("  \u2022 " + key)).join("\n") +
              ".\n\n" +
              "These options in your package.json Jest configuration " +
              "are not currently supported by Create React App:\n\n" +
              unsupportedKeys.map(key => chalk.bold("  \u2022 " + key)).join("\n") +
              "\n\nIf you wish to override other Jest options, you need to " +
              "eject from the default setup. You can do so by running " +
              chalk.bold("npm run eject") +
              " but remember that this is a one-way operation. " +
              "You may also file an issue with Create React App to discuss " +
              "supporting more options out of the box.\n"
          )
        );
      }

      process.exit(1);
    }
  }
  return config;
};