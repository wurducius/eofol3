const fs = require("fs")
const path = require("path")

const { checkExistsCreate, removeFilePart } = require("../util")
const { PATH_DERIVED } = require("../constants")

const writeView = (filename, content) => {
  const targetPath = path.resolve(PATH_DERIVED, filename)
  const targetDir = removeFilePart(targetPath)
  checkExistsCreate(targetDir)
  fs.writeFileSync(targetPath, content)
}

module.exports = writeView
