const chalk = require("chalk");

exports.promisifyProcess = proc =>
  new Promise((resolve, reject) => {
    proc.on("error", error => {
      reject(new Error(`${chalk.cyan(proc.spawnargs.join(" "))} encountered error: ${error}`));
    });
    proc.on("exit", code => {
      if (code !== 0) {
        reject(new Error(`${chalk.cyan(proc.spawnargs.join(" "))} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
