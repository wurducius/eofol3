const fs = require("fs");
const path = require("path");

const PATH_CWD = fs.realpathSync(process.cwd());
const PATH_DIST = path.resolve(PATH_CWD, "dist");
const PATH_BUILD = path.resolve(PATH_CWD, "build");
const PATH_DERIVED = path.resolve(PATH_CWD, "derived");

const cleanDir = (target) => {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true });
  }
};

cleanDir(PATH_DIST);
cleanDir(PATH_DERIVED);
cleanDir(PATH_BUILD);
