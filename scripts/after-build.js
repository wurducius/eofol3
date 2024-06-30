const fs = require("fs");
const path = require("path");

const UglifyJS = require("uglify-js");
const { minify } = UglifyJS;

const sharp = require("sharp");

const PATH_CWD = fs.realpathSync(process.cwd());
const PATH_DIST = path.resolve(PATH_CWD, "dist");
const PATH_BUILD = path.resolve(PATH_CWD, "build");

const sourceViews = fs.readdirSync(path.resolve(PATH_DIST, "views"));

const uglifyOptions = {
  parse: {},
  compress: false,
  mangle: true,
  output: {
    ast: true,
    //  code: false, // optional - faster if false
  },
};

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
  const minifiedScriptContent = minify(scriptContent.toString(), uglifyOptions);

  let rest = minifiedScriptContent.code;
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

fs.mkdirSync(path.resolve(PATH_BUILD, "assets", "css"));

sourceViews.forEach((view, i) => {
  const mutations = ["sm", "md", "lg"];

  mutations.forEach((mutation) => {
    const source = path.resolve(
      PATH_CWD,
      "src",
      "views",
      view,
      `${view}-${mutation}.css`
    );
    const target = path.resolve(
      PATH_BUILD,
      "assets",
      "css",
      `${view}-${mutation}.css`
    );

    if (fs.existsSync(source)) {
      const styleContent = fs.readFileSync(source);
      fs.writeFileSync(target, styleContent.toString());
    }
  });
});

const checkExistsCreate = (pathToCheck) => {
  if (!fs.existsSync(pathToCheck)) {
    fs.mkdirSync(pathToCheck, { recursive: true });
  }
};

const parsePublicTree = (node, source, target) => {
  if (Array.isArray(node)) {
    node.forEach((child) => {
      const nextPath = child.split("/")[0];
      const nodePath = path.resolve(target, nextPath);
      const sourcePath = path.resolve(source, nextPath);
      //  checkExistsCreate(target);
      return parsePublicTree(child, sourcePath, nodePath);
    });
  } else {
    if (node.endsWith(".html") || node.endsWith(".css")) {
      return;
    } else {
      if (source.includes(".")) {
        const nodeContent = fs.readFileSync(source);
        console.log(
          target
            .split("/")
            .filter((x, i) => i < x.length)
            .join("/")
        );
        checkExistsCreate(
          target
            .split("/")
            .filter((x, i) => i < x.length)
            .join("/")
        );
        console.log(
          target
            .split("/")
            .filter((x, i) => i < x.length)
            .join("/")
        );
        fs.writeFileSync(target, nodeContent, { recursive: true });
        // console.log(source);
        //  console.log(source, target);
        return;
      } else {
        /*
        return parsePublicTree(
          node,
          path.resolve(source, node),
          path.resolve(target, node)
        );
        */
      }
    }
  }
};

const mutationImageSizes = [
  { width: 767, breakpoint: "sm" },
  { width: 1287, breakpoint: "md" },
  { width: 1800, breakpoint: "lg" },
];

fs.mkdirSync(path.resolve(PATH_BUILD, "fonts"));

const publicTree = fs.readdirSync(path.resolve(PATH_CWD, "public"), {
  recursive: true,
});
publicTree.flat().forEach(async (x) => {
  if (!x.includes(".") || x.endsWith(".html") || x.endsWith(".css")) {
    return;
  }

  const publicFileContent = fs.readFileSync(
    path.resolve(PATH_CWD, "public", x)
  );

  let processedContent;
  if (x.includes(".jpg") || x.includes(".jpeg")) {
    mutationImageSizes.forEach(async (mutation) => {
      processedContent = await sharp(publicFileContent)
        .resize(mutation.width)
        .jpeg({ quality: 60 })
        .toBuffer();
      const filenameSplit = x.split(".");
      fs.writeFileSync(
        path.resolve(
          PATH_BUILD,
          `${filenameSplit[0]}-${mutation.breakpoint}.${filenameSplit[1]}`
        ),
        processedContent
      );
    });
  } else if (x.includes(".png")) {
    mutationImageSizes.forEach(async (mutation) => {
      processedContent = await sharp(publicFileContent)
        .resize(mutation.width)
        .png({ compressionLevel: 9 })
        .toBuffer();
      const filenameSplit = x.split(".");
      fs.writeFileSync(
        path.resolve(
          PATH_BUILD,
          `${filenameSplit[0]}-${mutation.breakpoint}.${filenameSplit[1]}`
        ),
        processedContent
      );
    });
  } else {
    processedContent = publicFileContent;
    fs.writeFileSync(path.resolve(PATH_BUILD, x), processedContent);
  }
});

/*
const publicTree = fs.readdirSync(path.resolve(PATH_CWD, "public"), {
  recursive: true,
});
const target = path.resolve(PATH_BUILD);
parsePublicTree(publicTree, path.resolve(PATH_CWD, "public"), target);
*/
