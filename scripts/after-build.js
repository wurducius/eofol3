const { PATH_BUILD } = require("../eofol/constants")
const { copyPublicDir, touchBuildDirs, compileScripts, copyPages, copyInternal } = require("../eofol/compiler")
const { prettySize, getDirSize, success } = require("../eofol/dev-util")

touchBuildDirs()

compileScripts()

copyPublicDir()
copyPages()
copyInternal()

// @TODO measure time delta since build start, probably have to extract to container script
console.log(
  success(`Project successfully built at ${PATH_BUILD}. Total bundle size ${prettySize(getDirSize(PATH_BUILD))}.`),
)
