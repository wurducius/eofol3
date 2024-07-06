const fs = require("fs")
const { resolve } = require("path")

const {
  PATH_VIEWS_DIST,
  PATH_ASSETS_CSS,
  PATH_ASSETS_FONTS,
  PATH_BUILD,
  PATH_ASSETS_JS,
  PATH_DERIVED,
  DIRNAME_EOFOL_INTERNAL,
} = require("../constants/paths")
const { checkExistsCreate } = require("../util/fs")
const compileScript = require("../compiler/script")
const compileStyle = require("../compiler/style")
const copyPublicDir = require("../compiler/public")
const { EXT_HTML } = require("../constants/common")

const babel = require("@babel/core")
const { minify } = require("uglify-js")
const { uglifyOptions, babelOptions } = require("../constants/after-build")

const PATH_DERIVED_INTERNAL = resolve(PATH_DERIVED, DIRNAME_EOFOL_INTERNAL)
const PATH_BUILD_INTERNAL = resolve(PATH_BUILD, DIRNAME_EOFOL_INTERNAL)

checkExistsCreate(PATH_BUILD)
checkExistsCreate(resolve(PATH_BUILD, "assets"))
checkExistsCreate(PATH_ASSETS_JS)
checkExistsCreate(PATH_ASSETS_CSS)
checkExistsCreate(PATH_ASSETS_FONTS)
checkExistsCreate(PATH_BUILD_INTERNAL)

const sourceViews = fs.readdirSync(PATH_VIEWS_DIST)

sourceViews.forEach((view, i) => compileScript(view))
sourceViews.forEach((view, i) => compileStyle(view))

copyPublicDir()

fs.readdirSync(PATH_DERIVED)
  .filter((filename) => filename.endsWith(EXT_HTML))
  .forEach((htmlFile) => {
    fs.copyFileSync(resolve(PATH_DERIVED, htmlFile), resolve(PATH_BUILD, htmlFile))
  })

fs.readdirSync(PATH_DERIVED_INTERNAL).forEach((filename) => {
  fs.copyFileSync(resolve(PATH_DERIVED_INTERNAL, filename), resolve(PATH_BUILD_INTERNAL, filename))
})

fs.readdirSync(PATH_ASSETS_JS).forEach((filename) => {
  const scriptPath = resolve(PATH_ASSETS_JS, filename)
  const babelized = babel.transformSync(fs.readFileSync(scriptPath), babelOptions).code
  const minified = minify(babelized.toString(), uglifyOptions).code
  fs.writeFileSync(scriptPath, minified)
})
