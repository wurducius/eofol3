const fs = require("fs");
const path = require("path");

const PATH_CWD = fs.realpathSync(process.cwd());
const PATH_DERIVED = path.resolve(PATH_CWD, "dist");

const sourceViews = fs.readdirSync(path.resolve(PATH_DERIVED, "views"));

function fixExports(scriptStr) {
  return scriptStr
    .toString()
    .replaceAll("export ", "")
    .replaceAll("default", "module.exports = ");
}

sourceViews.forEach((view) => {
  const source = path.resolve(PATH_DERIVED, "views", view, `${view}.js`);

  const scriptContent = fs.readFileSync(source);
  const exportsReplaced = fixExports(scriptContent);
  const x = exportsReplaced.toString().split("// @IMPORT-");

  const mid = x.map((y, i) => {
    const yy = y.replaceAll("END", "");

    if (yy.includes("// @IMPORT")) {
      const z = yy.split("// @IMPORT(");
      const res = z.reduce((acc, next, innerIndex) => {
        if (innerIndex === 0) {
          return acc;
        } else {
          const scriptPathRaw = next
            .replaceAll('"', "")
            .replaceAll(")", "")
            .trim();
          const script = fs.readFileSync(
            path.resolve(source, "..", scriptPathRaw + ".js")
          );
          return acc + script.toString();
        }
      }, "");
      return res;
    } else {
      return fixExports(yy);
    }
  });

  const result = fixExports(mid.join(""));

  fs.writeFileSync(source, result);
});
