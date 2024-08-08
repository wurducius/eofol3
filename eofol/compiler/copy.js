const fs = require("fs")
const path = require("path")
const {
  PATH_DERIVED,
  EXT_GZIP,
  COMPRESS_GZIP_BUILD_FILES,
  PATH_STATIC,
  FILENAME_FAVICON,
  PATH_BUILD,
  EXT_HTML,
  EXT_JPG,
  EXT_JPEG,
  EXT_PNG,
} = require("../constants")
const compileImg = require("./img")
const { breakpoints } = require("../../eofol-config")
const gzip = require("./gzip")
const hotUpdate = require("./hot-update")
const { checkExistsCreate, removeFilePart, read, write } = require("../util")
const { readDir } = require("../util/fs")

const copyStaticDir = async (isHot) => {
  const files = fs
    .readdirSync(PATH_STATIC, {
      recursive: true,
    })
    .flat()

  return await Promise.all(
    files.map(async (filenameFull) => {
      const filename = path.basename(filenameFull)

      if (!filename.includes(".") || filename.endsWith(EXT_HTML)) {
        return
      }

      const source = path.resolve(PATH_STATIC, filenameFull)
      const target = path.resolve(PATH_BUILD, filenameFull)
      const staticFileContent = read(source)

      if (filename.includes(FILENAME_FAVICON)) {
        write(target, staticFileContent)
        return
      }

      if (filename.includes(EXT_JPG) || filename.includes(EXT_JPEG) || filename.includes(EXT_PNG)) {
        const processedImgs = await compileImg(filename, staticFileContent)
        processedImgs.forEach((processedImgContent, i) => {
          const filenameSplit = filename.split(".")
          const resultPath = path.resolve(
            PATH_BUILD,
            "assets",
            "media",
            "images",
            `${filenameSplit[0]}-${breakpoints[i].name}.${filenameSplit[1]}`,
          )
          hotUpdate(isHot, resultPath, source, processedImgContent)
        })
      } else if (
        [".gif", ".webp", ".apng", ".tiff", ".bmp", ".heif"].filter((ext) => filename.includes(ext)).length > 0
      ) {
        const resultPath = path.resolve(PATH_BUILD, "assets", "media", "images", filename)
        hotUpdate(isHot, resultPath, source, staticFileContent)
      } else if (filename.includes(".svg")) {
        const resultPath = path.resolve(PATH_BUILD, "assets", "media", "icons", filename)
        hotUpdate(isHot, resultPath, source, staticFileContent)
      } else if ([".ttf", ".otf", ".woff", ".woff2", ".eot"].filter((ext) => filename.includes(ext)).length > 0) {
        const resultPath = path.resolve(PATH_BUILD, "assets", "media", "fonts", filename)
        hotUpdate(isHot, resultPath, source, staticFileContent)
      } else if (filename.includes(".css")) {
        const resultPath = path.resolve(PATH_BUILD, "assets", "css", filename)
        hotUpdate(isHot, resultPath, source, staticFileContent)
      } else {
        hotUpdate(isHot, target, source, staticFileContent)
      }
    }),
  )
}

const copyPages = (isHot) => {
  readDir(PATH_DERIVED, { recursive: true })
    .filter((filename) => path.basename(filename).endsWith(EXT_HTML))
    .forEach((htmlFile) => {
      const source = path.resolve(PATH_DERIVED, htmlFile)
      const target = path.resolve(PATH_BUILD, htmlFile)
      checkExistsCreate(path.resolve(PATH_BUILD, removeFilePart(htmlFile)))
      const content = read(source).toString()
      hotUpdate(isHot, target, source, content, () => {
        if (COMPRESS_GZIP_BUILD_FILES) {
          gzip(target, `${target}${EXT_GZIP}`, htmlFile)
        }
      })
    })
}

module.exports = { copyStaticDir, copyPages }
