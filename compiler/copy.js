const fs = require("fs")
const path = require("path")
const {
  PATH_PUBLIC,
  FILENAME_FAVICON,
  PATH_BUILD,
  EXT_HTML,
  EXT_CSS,
  EXT_JPG,
  EXT_JPEG,
  EXT_PNG,
} = require("../constants")
const compileImg = require("./img")
const { breakpoints } = require("../eofol-config")
const { PATH_DERIVED, PATH_DERIVED_INTERNAL, PATH_BUILD_INTERNAL } = require("../constants/paths")
const { COMPRESS_GZIP_BUILD_FILES } = require("../constants/after-build")
const gzip = require("./gzip")
const { EXT_GZIP } = require("../constants/common")

const copyPublicDir = () => {
  fs.readdirSync(PATH_PUBLIC, {
    recursive: true,
  })
    .flat()
    .forEach(async (filename) => {
      if (!filename.includes(".") || filename.endsWith(EXT_HTML) || filename.endsWith(EXT_CSS)) {
        return
      }

      const target = path.resolve(PATH_BUILD, filename)
      const publicFileContent = fs.readFileSync(path.resolve(PATH_PUBLIC, filename))

      if (filename.includes(FILENAME_FAVICON)) {
        fs.writeFileSync(target, publicFileContent)
        return
      }

      if (filename.includes(EXT_JPG) || filename.includes(EXT_JPEG) || filename.includes(EXT_PNG)) {
        const processedImgs = await compileImg(filename, publicFileContent)
        processedImgs.forEach((processedImgContent, i) => {
          const filenameSplit = filename.split(".")
          fs.writeFileSync(
            path.resolve(PATH_BUILD, `${filenameSplit[0]}-${breakpoints[i].name}.${filenameSplit[1]}`),
            processedImgContent,
          )
        })
      } else {
        fs.writeFileSync(target, publicFileContent)
      }
    })
}

const copyPages = () => {
  fs.readdirSync(PATH_DERIVED)
    .filter((filename) => filename.endsWith(EXT_HTML))
    .forEach((htmlFile) => {
      const targetPath = path.resolve(PATH_BUILD, htmlFile)
      fs.copyFileSync(path.resolve(PATH_DERIVED, htmlFile), targetPath)

      if (COMPRESS_GZIP_BUILD_FILES) {
        gzip(targetPath, `${targetPath}${EXT_GZIP}`, htmlFile)
      }
    })
}

const copyInternal = () => {
  fs.readdirSync(PATH_DERIVED_INTERNAL).forEach((filename) => {
    fs.copyFileSync(path.resolve(PATH_DERIVED_INTERNAL, filename), path.resolve(PATH_BUILD_INTERNAL, filename))
  })
}

module.exports = { copyPublicDir, copyPages, copyInternal }
