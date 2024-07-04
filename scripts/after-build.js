const fs = require("fs");
const path = require("path");

const UglifyJS = require("uglify-js");
const { minify } = UglifyJS;

const sharp = require("sharp");

const { breakpoints } = require("../eofol-config");
const { IMG_BASE_LOGO_WIDTH, uglifyOptions } = require("../constants/compile");
const { PATH_CWD, PATH_DIST, PATH_BUILD } = require("../constants/paths");

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

    match = extract(rest, "module.exports", "};");
    contains = rest.includes("module.exports");
  }
  fs.writeFileSync(target, rest);
});

fs.mkdirSync(path.resolve(PATH_BUILD, "assets", "css"));

sourceViews.forEach((view, i) => {
  breakpoints.forEach(({ name: mutation }) => {
    const source = path.resolve(
      PATH_CWD,
      "src",
      "views",
      view,
      `${view}-${mutation}.css`,
    );
    const target = path.resolve(
      PATH_BUILD,
      "assets",
      "css",
      `${view}-${mutation}.css`,
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
            .join("/"),
        );
        checkExistsCreate(
          target
            .split("/")
            .filter((x, i) => i < x.length)
            .join("/"),
        );
        console.log(
          target
            .split("/")
            .filter((x, i) => i < x.length)
            .join("/"),
        );
        fs.writeFileSync(target, nodeContent, { recursive: true });

        return;
      } else {
      }
    }
  }
};

const processImage = (format) => (imagePath, content, handler) => {
  breakpoints.forEach(async (breakpoint) => {
    const name = breakpoint.name;
    const imgBin = sharp(content);
    const metadata = await imgBin.metadata();
    const widthImpl =
      metadata.width <= IMG_BASE_LOGO_WIDTH
        ? breakpoint.logoWidth
        : breakpoint.imgWidth;
    const processedContent = handler(
      imgBin.resize(widthImpl),
      breakpoint[format],
    );
    const filenameSplit = imagePath.split(".");
    fs.writeFileSync(
      path.resolve(
        PATH_BUILD,
        `${filenameSplit[0]}-${name}.${filenameSplit[1]}`,
      ),
      await processedContent.toBuffer(),
    );
  });
};

const processImagePng = processImage("png");
const processImageJpg = processImage("jpg");

fs.mkdirSync(path.resolve(PATH_BUILD, "fonts"));

const publicTree = fs.readdirSync(path.resolve(PATH_CWD, "public"), {
  recursive: true,
});
publicTree.flat().forEach(async (x) => {
  if (!x.includes(".") || x.endsWith(".html") || x.endsWith(".css")) {
    return;
  }

  const publicFileContent = fs.readFileSync(
    path.resolve(PATH_CWD, "public", x),
  );

  if (x.includes("favicon")) {
    fs.writeFileSync(path.resolve(PATH_BUILD, x), publicFileContent);
    return;
  }

  if (x.includes(".jpg") || x.includes(".jpeg")) {
    processImageJpg(x, publicFileContent, (img, mutationQuality) =>
      img.jpeg({ quality: mutationQuality.compression }),
    );
  } else if (x.includes(".png")) {
    processImagePng(x, publicFileContent, (img, mutationQuality) =>
      img.png({ compressionLevel: mutationQuality.compression }),
    );
  } else {
    fs.writeFileSync(path.resolve(PATH_BUILD, x), publicFileContent);
  }
});
