const sharp = require("sharp")

const { breakpoints } = require("../eofol-config")
const { IMG_BASE_LOGO_WIDTH, PATH_BUILD, EXT_JPG, EXT_JPEG, EXT_PNG } = require("../constants")

const processImage = (format) => (imagePath, content, handler) =>
  Promise.all(
    breakpoints.map(async (breakpoint) => {
      const imgBin = sharp(content)
      const metadata = await imgBin.metadata()
      const widthImpl = metadata.width <= IMG_BASE_LOGO_WIDTH ? breakpoint.logoWidth : breakpoint.imgWidth
      const processedContent = handler(imgBin.resize(widthImpl), breakpoint[format])
      return processedContent.toBuffer()
    }),
  )

const processImagePng = processImage("png")
const processImageJpg = processImage("jpg")

const compileImg = (filename, content) => {
  if (filename.includes(EXT_JPG) || filename.includes(EXT_JPEG)) {
    return processImageJpg(filename, content, (img, mutationQuality) =>
      img.jpeg({ quality: mutationQuality.compression }),
    )
  } else if (filename.includes(EXT_PNG)) {
    return processImagePng(filename, content, (img, mutationQuality) =>
      img.png({ compressionLevel: mutationQuality.compression }),
    )
  }
}

module.exports = compileImg
