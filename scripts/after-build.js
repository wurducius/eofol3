const fs = require("fs");
const path = require("path");

const PATH_CWD = fs.realpathSync(process.cwd());
const PATH_DIST = path.resolve(PATH_CWD, "dist");
const PATH_BUILD = path.resolve(PATH_CWD, "build");

const sourceViews = fs.readdirSync(path.resolve(PATH_DIST, "views"));

sourceViews.forEach((view) => {
  const source = path.resolve(PATH_DIST, "views", view, `${view}.js`);
  const target = path.resolve(PATH_BUILD, "assets", "js", `${view}.js`);

  const scriptContent = fs.readFileSync(source);

  const result = scriptContent.toString().split("module.exports")[0];

  fs.writeFileSync(target, result);
});
