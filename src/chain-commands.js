const { spawn } = require("child_process");
const waitPort = require("wait-port");
const isPortFree = require("is-port-free");
const findFreePorts = require("find-free-ports");
const { info } = require("simple-output");
const { promisifyProcess } = require("./utils/process");
const { completeHandler, errorHandler } = require("./utils/handlers");

async function getOptions() {
  let command1, command2;
  const program = require("commander")
    .arguments("<cmd1> <cmd2>")
    .option("-p, --port <port>", "process port")
    .option("-t, --timeout <timeout>", "process timeout")
    .action((cmd1, cmd2) => ((command1 = cmd1), (command2 = cmd2)))
    .parse(process.argv);

  const host = "localhost";
  const port = parseInt(program.port) || (await findFreePorts())[0];

  return { host, port, command1, command2 };
}

function startProcess(command) {
  info(`Start npm process - ${command}...`);

  const process = spawn("npm", ["run", command], { stdio: "inherit" });
  process.on("exit", () => process.kill());

  return promisifyProcess(process);
}

function connectToPort(options) {
  const waitPortPromise = waitPort(options).catch(e => {
    console.log(e);
    throw new Error("First process didn't start in time");
  });
  console.log("\n");

  return waitPortPromise;
}

(async function main() {
  const options = await getOptions();

  await isPortFree(options.port).catch(() => {
    throw new Error(`Port ${options.port} is already in use`);
  });

  const processPromise = startProcess(options.command1);

  await connectToPort(options);
  await Promise.race([processPromise, startProcess(options.command2)]);

  completeHandler();
})().catch(errorHandler);
