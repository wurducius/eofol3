const fs = require("fs");
const path = require("path");

const { PATH_VIEWS_DIST } = require("../constants/paths");
const { EXT_JS } = require("../constants/common");

const fixExports = (scriptStr) =>
  scriptStr
    .toString()
    .replaceAll("export ", "")
    .replaceAll("default", "module.exports = ");

// ---------------------------------------------

fs.readdirSync(PATH_VIEWS_DIST).forEach((view) => {
  const source = path.resolve(PATH_VIEWS_DIST, view, `${view}${EXT_JS}`);
  const exportsReplaced = fixExports(fs.readFileSync(source));
  const x = exportsReplaced.toString().split("// @IMPORT-");

  const mid = x.map((y, i) => {
    const yy = y.replaceAll("END", "");

    if (yy.includes("// @IMPORT")) {
      const z = yy.split("// @IMPORT(");
      return z.reduce((acc, next, innerIndex) => {
        if (innerIndex === 0) {
          return acc;
        } else {
          const scriptPathRaw = next
            .replaceAll('"', "")
            .replaceAll(")", "")
            .trim();
          const script = fs.readFileSync(
            path.resolve(source, "..", scriptPathRaw + EXT_JS),
          );
          return acc + script.toString();
        }
      }, "");
    } else {
      return fixExports(yy);
    }
  });
  fs.writeFileSync(source, fixExports(mid.join("")));
});
