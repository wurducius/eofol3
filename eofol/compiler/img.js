const sharp = require("sharp")

const { breakpoints } = require("../../eofol-config")
const { EXT_JPG, EXT_JPEG, EXT_PNG } = require("../constants")

const processImage = (format) => (imagePath, content, handler) =>
  Promise.all(
    breakpoints.map(async (breakpoint) => {
      const imgBin = sharp(content)
      const metadata = await imgBin.metadata()
      const widthImpl = Math.min(metadata.width, metadata.width <= 512 ? breakpoint.logoWidth : breakpoint.imgWidth)
      const heightImpl = Math.round((metadata.height * widthImpl) / metadata.width)
      const processedContent = handler(imgBin.resize(widthImpl, heightImpl), breakpoint[format])
      // const processedContent = handler(imgBin, breakpoint[format])
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
      img.png({ compressionLevel: mutationQuality.compression, quality: 60, effort: 10 }),
    )
  }
}

module.exports = compileImg
