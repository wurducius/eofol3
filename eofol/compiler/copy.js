const fs = require("fs")
const path = require("path")
const { PATH_STATIC, FILENAME_FAVICON, PATH_BUILD, EXT_HTML, EXT_JPG, EXT_JPEG, EXT_PNG } = require("../constants")
const compileImg = require("./img")
const { breakpoints } = require("../../eofol-config")
const {
  PATH_DERIVED,
  PATH_DERIVED_INTERNAL,
  PATH_BUILD_INTERNAL,
  EXT_GZIP,
  COMPRESS_GZIP_BUILD_FILES,
} = require("../constants")
const gzip = require("./gzip")
const hotUpdate = require("./hot-update")

const copyStaticDir = (isHot) => {
  fs.readdirSync(PATH_STATIC, {
    recursive: true,
  })
    .flat()
    .forEach(async (filename) => {
      if (!filename.includes(".") || filename.endsWith(EXT_HTML)) {
        return
      }

      const source = path.resolve(PATH_STATIC, filename)
      const target = path.resolve(PATH_BUILD, filename)
      const staticFileContent = fs.readFileSync(source)

      if (filename.includes(FILENAME_FAVICON)) {
        fs.writeFileSync(target, staticFileContent)
        return
      }

      if (filename.includes(EXT_JPG) || filename.includes(EXT_JPEG) || filename.includes(EXT_PNG)) {
        const processedImgs = await compileImg(filename, staticFileContent)
        processedImgs.forEach((processedImgContent, i) => {
          const filenameSplit = filename.split(".")
          const resultPath = path.resolve(PATH_BUILD, `${filenameSplit[0]}-${breakpoints[i].name}.${filenameSplit[1]}`)
          hotUpdate(isHot, resultPath, source, processedImgContent)
        })
      } else {
        hotUpdate(isHot, target, source, staticFileContent)
      }
    })
}

const copyPages = (isHot) => {
  fs.readdirSync(PATH_DERIVED)
    .filter((filename) => filename.endsWith(EXT_HTML))
    .forEach((htmlFile) => {
      const source = path.resolve(PATH_DERIVED, htmlFile)
      const target = path.resolve(PATH_BUILD, htmlFile)
      const content = fs.readFileSync(source).toString()
      hotUpdate(isHot, target, source, content, () => {
        if (COMPRESS_GZIP_BUILD_FILES) {
          gzip(target, `${target}${EXT_GZIP}`, htmlFile)
        }
      })
    })
}

const copyInternal = (isHot) => {
  fs.readdirSync(PATH_DERIVED_INTERNAL).forEach((filename) => {
    const source = path.resolve(PATH_DERIVED_INTERNAL, filename)
    const target = path.resolve(PATH_BUILD_INTERNAL, filename)
    const content = fs.readFileSync(source).toString()
    hotUpdate(isHot, target, source, content)
  })
}

module.exports = { copyStaticDir, copyPages, copyInternal }
