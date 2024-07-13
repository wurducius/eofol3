const { PATH_BUILD } = require("../../eofol/constants")
const { copyPublicDir, touchBuildDirs, compileScripts, copyPages, copyInternal } = require("../../eofol/compiler")
const { prettySize, getDirSize, success } = require("../../eofol/dev-util")

const afterCompile = (isHot) => {
  if (!isHot) {
    touchBuildDirs()
  }

  compileScripts(isHot)

  copyPublicDir(isHot)
  copyPages(isHot)
  copyInternal(isHot)

  // @TODO measure time delta since build start, probably have to extract to container script
  console.log(
    success(`Project successfully built at ${PATH_BUILD}. Total bundle size ${prettySize(getDirSize(PATH_BUILD))}.`),
  )
}

module.exports = afterCompile
