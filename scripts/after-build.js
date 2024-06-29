const fs = require("fs");
const path = require("path");

const PATH_CWD = fs.realpathSync(process.cwd());
const PATH_DIST = path.resolve(PATH_CWD, "dist");
const PATH_BUILD = path.resolve(PATH_CWD, "build");

const PATH_SOURCE = path.resolve(PATH_DIST, "views", "index", "index.js");
const PATH_TARGET = path.resolve(PATH_BUILD, "assets", "js", "index.js");

const scriptContent = fs.readFileSync(PATH_SOURCE);

const result = scriptContent.toString().split("module.exports")[0];

fs.writeFileSync(PATH_TARGET, result);
