const fs = require("fs");
const path = require("path");

const sharp = require("sharp");

const { breakpoints } = require("../eofol-config");
const { IMG_BASE_LOGO_WIDTH } = require("../constants/after-build");
const { PATH_BUILD } = require("../constants/paths");
const { EXT_JPG, EXT_JPEG, EXT_PNG } = require("../constants/common");

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

const compileImg = (filename, content) => {
  if (filename.includes(EXT_JPG) || filename.includes(EXT_JPEG)) {
    processImageJpg(filename, content, (img, mutationQuality) =>
      img.jpeg({ quality: mutationQuality.compression }),
    );
  } else if (filename.includes(EXT_PNG)) {
    processImagePng(filename, content, (img, mutationQuality) =>
      img.png({ compressionLevel: mutationQuality.compression }),
    );
  }
};

module.exports = compileImg;
