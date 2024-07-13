const fs = require("fs")
const path = require("path")

const { pipe } = require("../util")
const { PATH_VIEWS_DIST2, EXT_JS, PATH_ASSETS_JS, COMPRESS_GZIP_BUILD_FILES, EXT_GZIP } = require("../constants")
const babelize = require("./babelize")
const gzip = require("./gzip")
const uglify = require("./uglify")
const checksum = require("./checksum")
const hotUpdate = require("./hot-update")

const CODE_MODULE_EXPORTS = "module.exports"
const CODE_EXPORT_SUFFIX = "};"

const extract = (s, prefix, suffix) => {
  let i = s.indexOf(prefix)
  if (i >= 0) {
    s = s.substring(i + prefix.length)
  } else {
    return ""
  }
  if (suffix) {
    i = s.indexOf(suffix)
    if (i >= 0) {
      s = s.substring(0, i)
    } else {
      return ""
    }
  }
  return s
}

const compileScript = (scriptContent) => {
  let rest = scriptContent
  let contains = rest.includes(CODE_MODULE_EXPORTS)
  let match = extract(rest, CODE_MODULE_EXPORTS, CODE_EXPORT_SUFFIX)
  while (contains) {
    rest = rest.split(match).reduce((acc, next, i) => {
      if (i === 0) {
        return acc + next.replace(CODE_MODULE_EXPORTS, "")
      } else if (i === 1) {
        return acc + next.replace(CODE_EXPORT_SUFFIX, "")
      } else {
        return acc + next
      }
    }, "")

    match = extract(rest, CODE_MODULE_EXPORTS, CODE_EXPORT_SUFFIX)
    contains = rest.includes(CODE_MODULE_EXPORTS)
  }

  return rest.toString()
}

const compileScripts = (isHot) => {
  fs.readdirSync(PATH_VIEWS_DIST2).forEach((view) => {
    const source = path.resolve(PATH_VIEWS_DIST2, view, `${view}${EXT_JS}`)
    const target = path.resolve(PATH_ASSETS_JS, `${view}${EXT_JS}`)

    hotUpdate(isHot, target, source, pipe(compileScript, babelize, uglify)(fs.readFileSync(source).toString()), () => {
      if (COMPRESS_GZIP_BUILD_FILES) {
        gzip(target, `${target}${EXT_GZIP}`, view)
      }
    })
  })
}

module.exports = compileScripts
