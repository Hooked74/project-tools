const { success } = require("simple-output");
const chalk = require("chalk");

module.exports = async (task, message) => {
  const start = Date.now();
  success(`${await task()} ${chalk.green(`in ${Date.now() - start}ms`)}`);
};
