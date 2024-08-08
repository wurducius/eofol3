const path = require("path")
const {
  PATH_VIEWS_DIST2,
  EXT_JS,
  PATH_ASSETS_JS,
  COMPRESS_GZIP_BUILD_FILES,
  EXT_GZIP,
  CODE_MODULE_EXPORTS,
} = require("../constants")
const babelize = require("./babelize")
const gzip = require("./gzip")
const uglify = require("./uglify")
const hotUpdate = require("./hot-update")
const { checkExistsCreate, pipe, read } = require("../util")
const writeInternal = require("./write-internal")

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

const compileViewScript = (view, vdom, instances, memoCache, assets) => (isHot) => {
  const viewName = path.basename(view)
  const source = path.resolve(PATH_VIEWS_DIST2, view, `${viewName}${EXT_JS}`)
  const target = path.resolve(PATH_ASSETS_JS, view, "..", `${viewName}${EXT_JS}`)

  checkExistsCreate(path.resolve(PATH_ASSETS_JS, view, ".."))

  hotUpdate(
    isHot,
    target,
    source,
    pipe(
      (res) => writeInternal(vdom, instances, memoCache, assets)(res),
      compileScript,
      babelize,
      uglify,
    )(read(source).toString()),
    () => {
      if (COMPRESS_GZIP_BUILD_FILES) {
        gzip(target, `${target}${EXT_GZIP}`, view)
      }
    },
  )
}

module.exports = compileViewScript
