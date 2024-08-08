const path = require("path")
const { pipe } = require("../util")
const babelize = require("./babelize")
const uglify = require("./uglify")
const {
  DIRNAME_EOFOL_INTERNAL,
  FILENAME_CORE,
  PATH_ASSETS_JS,
  PATH_DIST2,
  FILENAME_CORE_BUNDLE,
} = require("../constants")
const { read, write } = require("../util/fs")

const compileCore = () => {
  write(
    path.resolve(PATH_ASSETS_JS, FILENAME_CORE),
    pipe(
      (res) => `${res}\ninitEofol()`,
      babelize,
      uglify,
    )(
      read(path.resolve(PATH_DIST2, DIRNAME_EOFOL_INTERNAL, FILENAME_CORE_BUNDLE))
        .toString()
        .split("module.exports")[0],
    ),
  )
}

module.exports = compileCore
