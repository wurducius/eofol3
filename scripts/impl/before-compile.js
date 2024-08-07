const fs = require("fs")
const path = require("path")

const {
  PATH_VIEWS_DIST,
  PATH_VIEWS_DIST2,
  PATH_DIST,
  PATH_DIST2,
  DIRNAME_EOFOL_INTERNAL,
  EXT_JS,
  FILENAME_CORE,
  FILENAME_COMPILE,
  FILENAME_CORE_BUNDLE,
} = require("../../eofol/constants")
const { precompile } = require("../../eofol/compiler")
const { checkExistsCreate, isDirectory } = require("../../eofol/util/fs")
const { FILENAME_SUFFIX_STATIC } = require("../../eofol/constants/paths")

// ---------------------------------------------
// 1. Transforms script from ES module into CommonJS
// 2. Resolves imports (so far only depth 1 file)
// ---------------------------------------------

const beforeCompile = () => {
  checkExistsCreate(PATH_VIEWS_DIST2)

  fs.readdirSync(PATH_VIEWS_DIST, { recursive: true }).forEach((view) => {
    const lastViewPathname = path.basename(view)
    const viewScriptPath = path.resolve(PATH_VIEWS_DIST, view, `${lastViewPathname}${EXT_JS}`)
    if (isDirectory(path.resolve(PATH_VIEWS_DIST, view)) && fs.existsSync(viewScriptPath)) {
      checkExistsCreate(path.resolve(PATH_VIEWS_DIST2, view))
      precompile(viewScriptPath, "..", path.resolve(PATH_VIEWS_DIST2, view, `${lastViewPathname}${EXT_JS}`), true, true)
      precompile(
        viewScriptPath,
        "..",
        path.resolve(PATH_VIEWS_DIST2, view, `${lastViewPathname}${FILENAME_SUFFIX_STATIC}${EXT_JS}`),
        false,
        true,
        false,
      )
    }
  })

  checkExistsCreate(path.resolve(PATH_DIST2, DIRNAME_EOFOL_INTERNAL))

  precompile(
    path.resolve(PATH_DIST, DIRNAME_EOFOL_INTERNAL, FILENAME_CORE),
    "..",
    path.resolve(PATH_DIST2, DIRNAME_EOFOL_INTERNAL, FILENAME_CORE),
    false,
    false,
    false,
  )
  precompile(
    path.resolve(PATH_DIST, DIRNAME_EOFOL_INTERNAL, FILENAME_CORE),
    "..",
    path.resolve(PATH_DIST2, DIRNAME_EOFOL_INTERNAL, FILENAME_CORE_BUNDLE),
    false,
    false,
    true,
  )
  precompile(
    path.resolve(PATH_DIST, DIRNAME_EOFOL_INTERNAL, FILENAME_COMPILE),
    "..",
    path.resolve(PATH_DIST2, DIRNAME_EOFOL_INTERNAL, FILENAME_COMPILE),
    false,
    false,
    false,
  )
}

module.exports = beforeCompile
