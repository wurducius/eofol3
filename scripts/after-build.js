const fs = require("fs");
const path = require("path");

const UglifyJS = require("uglify-js");
const { minify } = UglifyJS;

const sharp = require("sharp");

const { breakpoints } = require("../eofol-config");
const {
  IMG_BASE_LOGO_WIDTH,
  uglifyOptions,
} = require("../constants/after-build");
const {
  PATH_BUILD,
  PATH_VIEWS_DIST,
  PATH_ASSETS_JS,
  PATH_ASSETS_CSS,
  PATH_VIEWS_SRC,
  PATH_ASSETS_FONTS,
  PATH_PUBLIC,
} = require("../constants/paths");
const { EXT_HTML, EXT_CSS, EXT_JS } = require("../constants/common");

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
  } else if (node.endsWith(EXT_HTML) || node.endsWith(EXT_CSS)) {
  } else {
    if (source.includes(".")) {
      const nodeContent = fs.readFileSync(source);
      checkExistsCreate(
        target
          .split("/")
          .filter((x, i) => i < x.length)
          .join("/"),
      );
      fs.writeFileSync(target, nodeContent, { recursive: true });
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

// ---------------------------------------------------

const sourceViews = fs.readdirSync(PATH_VIEWS_DIST);

sourceViews.forEach((view, i) => {
  const source = path.resolve(PATH_VIEWS_DIST, view, `${view}${EXT_JS}`);
  const target = path.resolve(PATH_ASSETS_JS, `${view}${EXT_JS}`);

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

fs.mkdirSync(PATH_ASSETS_CSS);

sourceViews.forEach((view, i) => {
  breakpoints.forEach(({ name: mutation }) => {
    const source = path.resolve(
      PATH_VIEWS_SRC,
      view,
      `${view}-${mutation}.css`,
    );
    const target = path.resolve(
      PATH_ASSETS_CSS,
      `${view}-${mutation}${EXT_CSS}`,
    );

    if (fs.existsSync(source)) {
      const styleContent = fs.readFileSync(source);
      fs.writeFileSync(target, styleContent.toString());
    }
  });
});

fs.mkdirSync(PATH_ASSETS_FONTS);

fs.readdirSync(PATH_PUBLIC, {
  recursive: true,
})
  .flat()
  .forEach(async (x) => {
    if (!x.includes(".") || x.endsWith(EXT_HTML) || x.endsWith(EXT_CSS)) {
      return;
    }

    const publicFileContent = fs.readFileSync(path.resolve(PATH_PUBLIC, x));

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
