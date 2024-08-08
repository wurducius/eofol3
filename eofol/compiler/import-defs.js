const path = require("path")
const { EXT_JS, PATH_VIEWS_DIST2, FILENAME_SUFFIX_STATIC } = require("../constants")

const importViewEofolDefs = (view) => {
  const eofolDefsJS = require(
    path.resolve(PATH_VIEWS_DIST2, view, path.basename(`${view}${FILENAME_SUFFIX_STATIC}${EXT_JS}`)),
  )
  return Object.keys(eofolDefsJS).map((eofolDefJS) => eofolDefsJS[eofolDefJS])
}

module.exports = importViewEofolDefs
