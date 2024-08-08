const path = require("path")

const { checkExistsCreate, removeFilePart, write } = require("../util")
const { PATH_DERIVED } = require("../constants")

const writeView = (filename, content) => {
  const targetPath = path.resolve(PATH_DERIVED, filename)
  const targetDir = removeFilePart(targetPath)
  checkExistsCreate(targetDir)
  write(targetPath, content)
}

module.exports = writeView
