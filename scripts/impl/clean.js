const { exists, rm, PATH_BUILD, PATH_DIST, PATH_DIST2 } = require("../../eofol")

const cleanDir = (target) => {
  if (exists(target)) {
    rm(target)
  }
}

const pathsToClean = [PATH_DIST, PATH_DIST2, PATH_BUILD]

const clean = () => {
  pathsToClean.forEach((pathToClean) => {
    cleanDir(pathToClean)
  })
}

module.exports = clean
