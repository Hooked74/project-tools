exports.isInGitRepository = function() {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
};

exports.isInMercurialRepository = function() {
  try {
    execSync("hg --cwd . root", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
};
