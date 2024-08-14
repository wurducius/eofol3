const path = require("path")

const { checkExistsCreate, removeFilePart, write } = require("../util")
const { PATH_BUILD, COMPRESS_GZIP_BUILD_FILES, EXT_GZIP } = require("../constants")
const gzip = require("./gzip")

const writeView = (filename, content) => {
  const targetPath = path.resolve(PATH_BUILD, filename)
  const targetDir = removeFilePart(targetPath)
  checkExistsCreate(targetDir)
  write(targetPath, content)
  if (COMPRESS_GZIP_BUILD_FILES) {
    gzip(targetPath, `${targetPath}${EXT_GZIP}`, filename)
  }
}

module.exports = writeView
