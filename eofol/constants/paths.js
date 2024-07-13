const fs = require("fs")
const path = require("path")

const DIRNAME_DIST = "dist"
const DIRNAME_DIST2 = "dist2"
const DIRNAME_DERIVED = "derived"
const DIRNAME_BUILD = "build"
const DIRNAME_SRC = "src"
const DIRNAME_VIEWS = "views"
const DIRNAME_PAGES = "pages"
const DIRNAME_STATIC = "static"
const DIRNAME_ASSETS = "assets"
const DIRNAME_EOFOL_INTERNAL = "eofol"
const DIRNAME_ASSET_JS = "js"
const DIRNAME_ASSET_CSS = "css"
const DIRNAME_ASSET_FONT = "fonts"

const FILENAME_FAVICON = "favicon"
const FILENAME_SUFFIX_EOFOL_INTERNALS = "-eofol-internals.json"
const FILENAME_CORE = "core.js"

const PATH_CWD = fs.realpathSync(process.cwd())
const PATH_DIST = path.resolve(PATH_CWD, DIRNAME_DIST)
const PATH_DIST2 = path.resolve(PATH_CWD, DIRNAME_DIST2)
const PATH_DERIVED = path.resolve(PATH_CWD, DIRNAME_DERIVED)
const PATH_BUILD = path.resolve(PATH_CWD, DIRNAME_BUILD)
const PATH_SRC = path.resolve(PATH_CWD, DIRNAME_SRC)
const PATH_VIEWS_SRC = path.resolve(PATH_SRC, DIRNAME_VIEWS)
const PATH_VIEWS_DIST = path.resolve(PATH_DIST, DIRNAME_VIEWS)
const PATH_VIEWS_DIST2 = path.resolve(PATH_DIST2, DIRNAME_VIEWS)
const PATH_ASSETS = path.resolve(PATH_BUILD, DIRNAME_ASSETS)
const PATH_ASSETS_JS = path.resolve(PATH_ASSETS, DIRNAME_ASSET_JS)
const PATH_ASSETS_CSS = path.resolve(PATH_ASSETS, DIRNAME_ASSET_CSS)
const PATH_ASSETS_FONTS = path.resolve(PATH_BUILD, DIRNAME_ASSET_FONT)
const PATH_EOFOL_INTERNAL = path.resolve(PATH_BUILD, DIRNAME_EOFOL_INTERNAL)
const PATH_PAGES = path.resolve(PATH_CWD, DIRNAME_PAGES)
const PATH_STATIC = path.resolve(PATH_CWD, DIRNAME_STATIC)
const PATH_DERIVED_INTERNAL = path.resolve(PATH_DERIVED, DIRNAME_EOFOL_INTERNAL)
const PATH_BUILD_INTERNAL = path.resolve(PATH_BUILD, DIRNAME_EOFOL_INTERNAL)

module.exports = {
  PATH_CWD,
  PATH_DIST,
  PATH_DIST2,
  PATH_DERIVED,
  PATH_BUILD,
  PATH_SRC,
  PATH_VIEWS_SRC,
  PATH_VIEWS_DIST,
  PATH_VIEWS_DIST2,
  PATH_ASSETS_JS,
  PATH_ASSETS_CSS,
  PATH_ASSETS_FONTS,
  PATH_EOFOL_INTERNAL,
  PATH_STATIC,
  PATH_PAGES,
  FILENAME_SUFFIX_EOFOL_INTERNALS,
  FILENAME_FAVICON,
  FILENAME_CORE,
  DIRNAME_EOFOL_INTERNAL,
  DIRNAME_VIEWS,
  PATH_DERIVED_INTERNAL,
  PATH_BUILD_INTERNAL,
  PATH_ASSETS,
}