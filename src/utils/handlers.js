const { error, success } = require("simple-output");

exports.completeHandler = () => {
  success("Process completed!");
  process.exit(0);
};

exports.errorHandler = e => {
  error(e instanceof Error ? e.stack : e);
  process.exit(1);
};
