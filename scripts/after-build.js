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
const copyPublicDir = require("../compiler/public")
const { EXT_HTML, EXT_GZIP } = require("../constants/common")

const babel = require("@babel/core")
const { minify } = require("uglify-js")
const { uglifyOptions, babelOptions, COMPRESS_GZIP_BUILD_FILES } = require("../constants/after-build")
const gzip = require("../compiler/gzip")

const PATH_DERIVED_INTERNAL = resolve(PATH_DERIVED, DIRNAME_EOFOL_INTERNAL)
const PATH_BUILD_INTERNAL = resolve(PATH_BUILD, DIRNAME_EOFOL_INTERNAL)

const appendGzipExt = (sourcePath) => `${sourcePath}${EXT_GZIP}`

const babelize = (content) => babel.transformSync(content, babelOptions).code

const uglify = (content) => minify(content, uglifyOptions).code

checkExistsCreate(PATH_BUILD)
checkExistsCreate(resolve(PATH_BUILD, "assets"))
checkExistsCreate(PATH_ASSETS_JS)
checkExistsCreate(PATH_ASSETS_CSS)
checkExistsCreate(PATH_ASSETS_FONTS)
checkExistsCreate(PATH_BUILD_INTERNAL)

const sourceViews = fs.readdirSync(PATH_VIEWS_DIST)

sourceViews.forEach((view, i) => compileScript(view))

copyPublicDir()

fs.readdirSync(PATH_DERIVED)
  .filter((filename) => filename.endsWith(EXT_HTML))
  .forEach((htmlFile) => {
    const targetPath = resolve(PATH_BUILD, htmlFile)
    fs.copyFileSync(resolve(PATH_DERIVED, htmlFile), targetPath)

    if (COMPRESS_GZIP_BUILD_FILES) {
      gzip(targetPath, appendGzipExt(targetPath), htmlFile)
    }
  })

fs.readdirSync(PATH_DERIVED_INTERNAL).forEach((filename) => {
  fs.copyFileSync(resolve(PATH_DERIVED_INTERNAL, filename), resolve(PATH_BUILD_INTERNAL, filename))
})

fs.readdirSync(PATH_ASSETS_JS).forEach((filename) => {
  const scriptPath = resolve(PATH_ASSETS_JS, filename)
  const babelized = babelize(fs.readFileSync(scriptPath))
  const minified = uglify(babelized.toString())
  fs.writeFileSync(scriptPath, minified)

  if (COMPRESS_GZIP_BUILD_FILES) {
    gzip(scriptPath, appendGzipExt(scriptPath), filename)
  }
})
