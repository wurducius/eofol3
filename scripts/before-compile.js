const fs = require("fs");
const path = require("path");

const PATH_CWD = fs.realpathSync(process.cwd());
const PATH_DERIVED = path.resolve(PATH_CWD, "dist");

const PATH_SOURCE = path.resolve(PATH_DERIVED, "views", "index", "index.js");

const scriptContent = fs.readFileSync(PATH_SOURCE);

const result = scriptContent
  .toString()
  .replaceAll("export ", "")
  .replace("default", "module.exports = ");

fs.writeFileSync(PATH_SOURCE, result);
