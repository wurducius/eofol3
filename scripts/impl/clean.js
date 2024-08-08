const fs = require("fs")

const { PATH_DERIVED, PATH_BUILD, PATH_DIST, PATH_DIST2 } = require("../../eofol")

const cleanDir = (target) => {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true })
  }
}

const pathsToClean = [PATH_DIST, PATH_DIST2, PATH_DERIVED, PATH_BUILD]

const clean = () => {
  pathsToClean.forEach((pathToClean) => {
    cleanDir(pathToClean)
  })
}

module.exports = clean
