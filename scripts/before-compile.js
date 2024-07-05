const fs = require("fs");
const path = require("path");

const {
  PATH_VIEWS_DIST,
  PATH_DIST,
  DIRNAME_EOFOL_INTERNAL,
} = require("../constants/paths");
const { EXT_JS } = require("../constants/common");

const fixExports = (scriptStr) =>
  scriptStr
    .toString()
    .replaceAll("export ", "")
    .replaceAll("default ", "module.exports = ");

const resolveImports = (sourcePath, content) =>
  content
    .toString()
    .split("// @IMPORT-")
    .map((y, i) => {
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
              path.resolve(sourcePath, "..", scriptPathRaw + EXT_JS),
            );
            return acc + script.toString();
          }
        }, "");
      } else {
        return fixExports(yy);
      }
    });

const precompile = (source) => {
  const content = fs.readFileSync(source);
  const exportsReplaced = fixExports(content);
  const importsResolved = resolveImports(source, exportsReplaced);
  fs.writeFileSync(source, fixExports(importsResolved.join("")));
};

// ---------------------------------------------
// 1. Transforms script from ES module into CommonJS
// 2. Resolves imports (so far only depth 1 file)
// ---------------------------------------------

fs.readdirSync(PATH_VIEWS_DIST).forEach((view) => {
  const source = path.resolve(PATH_VIEWS_DIST, view, `${view}${EXT_JS}`);
  precompile(source);
});

precompile(path.resolve(PATH_DIST, DIRNAME_EOFOL_INTERNAL, `core${EXT_JS}`));
