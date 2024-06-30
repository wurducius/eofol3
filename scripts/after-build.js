const fs = require("fs");
const path = require("path");

const UglifyJS = require("uglify-js");
const { minify } = UglifyJS;

const sharp = require("sharp");

const PATH_CWD = fs.realpathSync(process.cwd());
const PATH_DIST = path.resolve(PATH_CWD, "dist");
const PATH_BUILD = path.resolve(PATH_CWD, "build");

const sourceViews = fs.readdirSync(path.resolve(PATH_DIST, "views"));

const MUTATIONS = ["sm", "md", "lg"];
const MUTATIONS_IMG_WIDTH = [
  { width: 767, breakpoint: "sm" },
  { width: 1287, breakpoint: "md" },
  { width: 1800, breakpoint: "lg" },
];
const MUTATIONS_LOGO_WIDTH = [
  { width: 192, breakpoint: "sm" },
  { width: 320, breakpoint: "md" },
  { width: 512, breakpoint: "lg" },
];
const IMG_BASE_LOGO_WIDTH = 512;
const uglifyOptions = {
  parse: {},
  compress: false,
  mangle: true,
  output: {
    ast: true,
    //  code: false, // optional - faster if false
  },
};

const IMG_COMPRESS_PNG_COMPRESSION_LEVEL = [
  { compression: 9, breakpoint: "sm" },
  { compression: 9, breakpoint: "md" },
  { compression: 9, breakpoint: "lg" },
];
const IMG_COMPRESS_JPG_COMPRESSION_QUALITY = [
  { compression: 30, breakpoint: "sm" },
  { compression: 30, breakpoint: "md" },
  { compression: 30, breakpoint: "lg" },
];

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
  MUTATIONS.forEach((mutation) => {
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

        return;
      } else {
      }
    }
  }
};

const processImage = (imagePath, content, handler, mutationQuality) => {
  MUTATIONS_IMG_WIDTH.forEach(async (mutation) => {
    const imgBin = sharp(content);
    const metadata = await imgBin.metadata();
    const metadataWidth = metadata.width;
    const widthImpl =
      metadataWidth <= IMG_BASE_LOGO_WIDTH
        ? MUTATIONS_LOGO_WIDTH.find((x) => x.breakpoint === mutation.breakpoint)
            .width
        : mutation.width;
    const processedContent = handler(
      imgBin.resize(widthImpl),
      mutationQuality.find((y) => y.breakpoint === mutation.breakpoint)
    );
    const filenameSplit = imagePath.split(".");
    fs.writeFileSync(
      path.resolve(
        PATH_BUILD,
        `${filenameSplit[0]}-${mutation.breakpoint}.${filenameSplit[1]}`
      ),
      await processedContent.toBuffer()
    );
  });
};

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

  if (x.includes("favicon")) {
    fs.writeFileSync(path.resolve(PATH_BUILD, x), publicFileContent);
    return;
  }

  if (x.includes(".jpg") || x.includes(".jpeg")) {
    processImage(
      x,
      publicFileContent,
      (img, mutationQuality) =>
        img.jpeg({ quality: mutationQuality.compression }),
      IMG_COMPRESS_JPG_COMPRESSION_QUALITY
    );
  } else if (x.includes(".png")) {
    processImage(
      x,
      publicFileContent,
      (img, mutationQuality) =>
        img.png({ compressionLevel: mutationQuality.compression }),
      IMG_COMPRESS_PNG_COMPRESSION_LEVEL
    );
  } else {
    fs.writeFileSync(path.resolve(PATH_BUILD, x), publicFileContent);
  }
});

/*
const publicTree = fs.readdirSync(path.resolve(PATH_CWD, "public"), {
  recursive: true,
});
const target = path.resolve(PATH_BUILD);
parsePublicTree(publicTree, path.resolve(PATH_CWD, "public"), target);
*/
