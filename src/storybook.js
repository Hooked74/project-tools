const { spawn } = require("child_process");
const { join } = require("path");
const waitPort = require("wait-port");
const isPortFree = require("is-port-free");
const findFreePorts = require("find-free-ports");
const { error, info, success } = require("simple-output");
const { promisifyProcess } = require("./utils/process");

async function getOptions() {
  let command;
  const program = require("commander")
    .arguments("<cmd>")
    .option("-p, --port <port>", "storybook port")
    .option("-t, --timeout <timeout>", "storybook process timeout")
    .option("--ci", "CI mode (skip interactive prompts, don't open browser)")
    .action(cmd => (command = cmd))
    .parse(process.argv);

  const host = "localhost";
  const port = parseInt(program.port) || (await findFreePorts())[0];
  const timeout = parseInt(program.timeout) || 60000;

  return { host, port, timeout, command, ci: program.ci };
}

function startStorybookProcess(port, ci) {
  info("Start storybook process...");

  const storybook = spawn(
    process.execPath,
    [join("node_modules", ".bin", "start-storybook"), "-p", port, ci && "--ci"].filter(Boolean),
    { stdio: "inherit", cwd: process.cwd() }
  );

  process.on("exit", () => storybook.kill());

  return promisifyProcess(storybook);
}

function connectToPort(options) {
  const waitPortPromise = waitPort(options).catch(e => {
    console.log(e);
    throw new Error("Storybook didn't start in time");
  });
  console.log("\n");

  return waitPortPromise;
}

function startNpmProcess(command) {
  info("Start npm process...");

  const child = spawn("npm", ["run", command], {
    stdio: "inherit"
  });
  process.on("exit", () => child.kill());

  return promisifyProcess(child);
}

function completeHandler() {
  success("Process completed!");
  process.exit(0);
}

function errorHandler(e) {
  error(e instanceof Error ? e.stack : e);
  process.exit(1);
}

(async function main() {
  const options = await getOptions();

  await isPortFree(options.port).catch(() => {
    throw new Error(`Port ${options.port} is already in use`);
  });

  const storybookPromise = startStorybookProcess(options.port, options.ci);

  await connectToPort(options);
  await Promise.race([storybookPromise, startNpmProcess(options.command)]);

  completeHandler();
})().catch(errorHandler);
