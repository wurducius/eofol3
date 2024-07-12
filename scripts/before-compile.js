const fs = require("fs")
const path = require("path")

const { PATH_VIEWS_DIST, PATH_DIST, DIRNAME_EOFOL_INTERNAL, EXT_JS } = require("../constants")
const { precompile } = require("../compiler")

// ---------------------------------------------
// 1. Transforms script from ES module into CommonJS
// 2. Resolves imports (so far only depth 1 file)
// ---------------------------------------------

fs.readdirSync(PATH_VIEWS_DIST).forEach((view) => {
  precompile(path.resolve(PATH_VIEWS_DIST, view, `${view}${EXT_JS}`), "..")
})

precompile(path.resolve(PATH_DIST, DIRNAME_EOFOL_INTERNAL, `core${EXT_JS}`), "..")
