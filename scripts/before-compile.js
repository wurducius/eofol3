const fs = require("fs");
const path = require("path");

const { PATH_VIEWS_DIST } = require("../constants/paths");

const fixExports = (scriptStr) =>
  scriptStr
    .toString()
    .replaceAll("export ", "")
    .replaceAll("default", "module.exports = ");

// ---------------------------------------------

fs.readdirSync(PATH_VIEWS_DIST).forEach((view) => {
  const source = path.resolve(PATH_VIEWS_DIST, view, `${view}.js`);
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
            path.resolve(source, "..", scriptPathRaw + ".js"),
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
