const fs = require("fs");
const path = require("path");

const PATH_CWD = fs.realpathSync(process.cwd());
const PATH_DERIVED = path.resolve(PATH_CWD, "dist");

const sourceViews = fs.readdirSync(path.resolve(PATH_DERIVED, "views"));

sourceViews.forEach((view) => {
  const source = path.resolve(PATH_DERIVED, "views", view, `${view}.js`);

  const scriptContent = fs.readFileSync(source);

  const result = scriptContent
    .toString()
    .replaceAll("export ", "")
    .replace("default", "module.exports = ");

  fs.writeFileSync(source, result);
});
