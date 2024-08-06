const { copyStaticDir, touchBuildDirs, compileScripts, copyPages } = require("../../eofol/compiler")

const afterCompile = (isHot) => {
  if (!isHot) {
    touchBuildDirs()
  }

  compileScripts(isHot)

  return copyStaticDir(isHot).then(() => {
    copyPages(isHot)
  })
}

module.exports = afterCompile
