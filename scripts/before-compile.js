const fs = require("fs")
const path = require("path")

const {
  PATH_VIEWS_DIST,
  PATH_VIEWS_DIST2,
  PATH_DIST,
  PATH_DIST2,
  DIRNAME_EOFOL_INTERNAL,
  EXT_JS,
} = require("../eofol/constants")
const { precompile } = require("../eofol/compiler")
const { checkExistsCreate } = require("../eofol/util/fs")

// ---------------------------------------------
// 1. Transforms script from ES module into CommonJS
// 2. Resolves imports (so far only depth 1 file)
// ---------------------------------------------

checkExistsCreate(PATH_VIEWS_DIST2)

fs.readdirSync(PATH_VIEWS_DIST).forEach((view) => {
  checkExistsCreate(path.resolve(PATH_VIEWS_DIST2, view))
  precompile(
    path.resolve(PATH_VIEWS_DIST, view, `${view}${EXT_JS}`),
    "..",
    path.resolve(PATH_VIEWS_DIST2, view, `${view}${EXT_JS}`),
  )
})

checkExistsCreate(path.resolve(PATH_DIST2, DIRNAME_EOFOL_INTERNAL))

precompile(
  path.resolve(PATH_DIST, DIRNAME_EOFOL_INTERNAL, `core${EXT_JS}`),
  "..",
  path.resolve(PATH_DIST2, DIRNAME_EOFOL_INTERNAL, `core${EXT_JS}`),
)
