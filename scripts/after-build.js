const fs = require("fs")
const path = require("path")

const {
  PATH_VIEWS_DIST,
  PATH_ASSETS_CSS,
  PATH_ASSETS_FONTS,
  PATH_BUILD,
  PATH_ASSETS,
  PATH_ASSETS_JS,
  PATH_DERIVED,
  PATH_DERIVED_INTERNAL,
  PATH_BUILD_INTERNAL,
  EXT_HTML,
  EXT_GZIP,
  uglifyOptions,
  COMPRESS_GZIP_BUILD_FILES,
} = require("../constants")
const { checkExistsCreate } = require("../util")
const { compileScript, copyPublicDir, gzip, babelize } = require("../compiler")
const { EXT_JS } = require("../constants/common")
const { pipe } = require("../util/func")
const { prettySize, prettyTime } = require("../dev-util")

const { minify } = require("uglify-js")

const appendGzipExt = (sourcePath) => `${sourcePath}${EXT_GZIP}`

const uglify = (content) => minify(content, uglifyOptions).code

const touchBuildDir = () => {
  checkExistsCreate(PATH_BUILD)
  checkExistsCreate(PATH_ASSETS)
  checkExistsCreate(PATH_ASSETS_JS)
  checkExistsCreate(PATH_ASSETS_CSS)
  checkExistsCreate(PATH_ASSETS_FONTS)
  checkExistsCreate(PATH_BUILD_INTERNAL)
}

const compileScripts = () => {
  fs.readdirSync(PATH_VIEWS_DIST).forEach((view) => {
    const source = path.resolve(PATH_VIEWS_DIST, view, `${view}${EXT_JS}`)
    const target = path.resolve(PATH_ASSETS_JS, `${view}${EXT_JS}`)

    fs.writeFileSync(target, pipe(compileScript, babelize, uglify)(fs.readFileSync(source).toString()))

    if (COMPRESS_GZIP_BUILD_FILES) {
      gzip(target, appendGzipExt(target), view)
    }
  })
}

const copyInternal = () => {
  fs.readdirSync(PATH_DERIVED_INTERNAL).forEach((filename) => {
    fs.copyFileSync(path.resolve(PATH_DERIVED_INTERNAL, filename), path.resolve(PATH_BUILD_INTERNAL, filename))
  })
}

const copyPages = () => {
  fs.readdirSync(PATH_DERIVED)
    .filter((filename) => filename.endsWith(EXT_HTML))
    .forEach((htmlFile) => {
      const targetPath = path.resolve(PATH_BUILD, htmlFile)
      fs.copyFileSync(path.resolve(PATH_DERIVED, htmlFile), targetPath)

      if (COMPRESS_GZIP_BUILD_FILES) {
        gzip(targetPath, appendGzipExt(targetPath), htmlFile)
      }
    })
}

// ------------------------------------------------------------

touchBuildDir()

compileScripts()

copyPublicDir()

copyPages()

copyInternal()

const getDirSize = (dirPath) => {
  let size = 0
  const files = fs.readdirSync(dirPath)

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dirPath, files[i])
    const stats = fs.statSync(filePath)

    if (stats.isFile()) {
      size += stats.size
    } else if (stats.isDirectory()) {
      size += getDirSize(filePath)
    }
  }

  return size
}

const buildSize = getDirSize(PATH_BUILD)

console.log(`Project successfully built at ${PATH_BUILD}. Total bundle size ${prettySize(buildSize)}.`)
