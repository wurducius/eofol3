const fs = require("fs");
const path = require("path");
const { PATH_ASSETS_JS, PATH_VIEWS_DIST } = require("../constants/paths");
const { EXT_JS } = require("../constants/common");
const { uglifyOptions } = require("../constants/after-build");
const { minify } = require("uglify-js");

const CODE_MODULE_EXPORTS = "module.exports";
const CODE_EXPORT_SUFFIX = "};";

const extract = (s, prefix, suffix) => {
  let i = s.indexOf(prefix);
  if (i >= 0) {
    s = s.substring(i + prefix.length);
  } else {
    return "";
  }
  if (suffix) {
    i = s.indexOf(suffix);
    if (i >= 0) {
      s = s.substring(0, i);
    } else {
      return "";
    }
  }
  return s;
};

const compileScript = (view) => {
  const source = path.resolve(PATH_VIEWS_DIST, view, `${view}${EXT_JS}`);
  const target = path.resolve(PATH_ASSETS_JS, `${view}${EXT_JS}`);

  const scriptContent = fs.readFileSync(source);
  const minifiedScriptContent = minify(scriptContent.toString(), uglifyOptions);

  let rest = minifiedScriptContent.code;
  let contains = rest.includes(CODE_MODULE_EXPORTS);
  let match = extract(rest, CODE_MODULE_EXPORTS, CODE_EXPORT_SUFFIX);
  while (contains) {
    rest = rest.split(match).reduce((acc, next, i) => {
      if (i === 0) {
        return acc + next.replace(CODE_MODULE_EXPORTS, "");
      } else if (i === 1) {
        return acc + next.replace(CODE_EXPORT_SUFFIX, "");
      } else {
        return acc + next;
      }
    }, "");

    match = extract(rest, CODE_MODULE_EXPORTS, CODE_EXPORT_SUFFIX);
    contains = rest.includes(CODE_MODULE_EXPORTS);
  }
  fs.writeFileSync(target, rest);
};

module.exports = compileScript;
