const { copyStaticDir, touchBuildDirs, compileScripts, copyPages, copyInternal } = require("../../eofol/compiler")

const afterCompile = (isHot) => {
  if (!isHot) {
    touchBuildDirs()
  }

  compileScripts(isHot)

  copyStaticDir(isHot)
  copyPages(isHot)
  copyInternal(isHot)
}

module.exports = afterCompile
