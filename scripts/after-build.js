const fs = require("fs");
const path = require("path");

const PATH_CWD = fs.realpathSync(process.cwd());
const PATH_DIST = path.resolve(PATH_CWD, "dist");
const PATH_BUILD = path.resolve(PATH_CWD, "build");

const sourceViews = fs.readdirSync(path.resolve(PATH_DIST, "views"));

function extract(s, prefix, suffix) {
  var i = s.indexOf(prefix);
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
}

sourceViews.forEach((view, i) => {
  const source = path.resolve(PATH_DIST, "views", view, `${view}.js`);
  const target = path.resolve(PATH_BUILD, "assets", "js", `${view}.js`);

  const scriptContent = fs.readFileSync(source);

  let rest = scriptContent.toString();
  let contains = rest.includes("module.exports");
  let match = extract(rest, "module.exports", "};");
  while (contains) {
    rest = rest.split(match).reduce((acc, next, i) => {
      if (i === 0) {
        return acc + next.replace("module.exports", "");
      } else if (i === 1) {
        return acc + next.replace("};", "");
      } else {
        return acc + next;
      }
    }, "");
    /*
    rest = rest
      .replace(match, "")
      .replace("module.exports", "")
      .replace("};", "");
      */
    match = extract(rest, "module.exports", "};");
    contains = rest.includes("module.exports");
  }
  fs.writeFileSync(target, rest);
});
