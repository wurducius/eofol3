const { copyStaticDir, touchBuildDirs, compileScripts, copyPages, copyInternal } = require("../../eofol/compiler")

const afterCompile = (isHot) => {
  if (!isHot) {
    touchBuildDirs()
  }

  compileScripts(isHot)

  return copyStaticDir(isHot).then(() => {
    copyPages(isHot)
    copyInternal(isHot)
  })
}

module.exports = afterCompile
