const fs = require("fs")
const path = require("path")
const { FILENAME_CORE, PATH_ASSETS_JS, PATH_DIST2 } = require("../constants/paths")
const { pipe } = require("../util")
const babelize = require("./babelize")
const uglify = require("./uglify")
const { DIRNAME_EOFOL_INTERNAL } = require("../constants")

const compileCore = () => {
  fs.writeFileSync(
    path.resolve(PATH_ASSETS_JS, FILENAME_CORE),
    pipe(babelize, uglify)(fs.readFileSync(path.resolve(PATH_DIST2, DIRNAME_EOFOL_INTERNAL, "core-bundle.js"))),
  )
}

module.exports = compileCore