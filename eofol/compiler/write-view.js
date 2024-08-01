const fs = require("fs")
const path = require("path")

const { checkExistsCreate, removeFilePart } = require("../util")
const { DIRNAME_EOFOL_INTERNAL, PATH_DERIVED } = require("../constants")
const writeInternal = require("./write-internal")

const writeView = (filename, content, vdom, instances, memoCache) => {
  const targetPath = path.resolve(PATH_DERIVED, filename)
  const targetDir = removeFilePart(targetPath)
  checkExistsCreate(targetDir)
  fs.writeFileSync(targetPath, content)
  const internalDir = path.resolve(targetDir, DIRNAME_EOFOL_INTERNAL)
  checkExistsCreate(internalDir)
  writeInternal(vdom, instances, memoCache, internalDir, filename)
}

module.exports = writeView
