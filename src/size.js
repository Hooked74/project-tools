const { error, message } = require("simple-output");
const { resolve } = require("path");
const { writeFileSync, readFileSync, existsSync } = require("fs");
const pkg = require("../package");
const log = require("./utils/log");

const sizeSnapshotPath = resolve(".size-snapshot.json");
const units = ["B", "kB", "MB", "GB"];

function convertSize(size, unitIterator, lastUnitValue) {
  const unit = unitIterator.next();

  return size >= 1024 && !unit.done
    ? convertSize(Math.round((size / 1024) * 100) / 100, unitIterator, lastUnitValue)
    : `${size} ${unit.value || lastUnitValue}`;
}

(async function main() {
  if (existsSync(sizeSnapshotPath)) {
    message(`Start build size conversion. Parse ${sizeSnapshotPath}`);

    const sizeJson = JSON.parse(readFileSync(sizeSnapshotPath));

    await log(async () => {
      sizeJson.module = convertSize(
        sizeJson[pkg.main].gzipped,
        units.values(),
        units[units.length - 1]
      );
      return "Convert module size";
    });

    await log(async () => {
      writeFileSync(sizeSnapshotPath, JSON.stringify(sizeJson, null, 2));
      return "Overwrite file with sizes";
    });

    message("End build size conversion");
  } else {
    error(`${sizeSnapshotPath} not found`);
  }
})();
