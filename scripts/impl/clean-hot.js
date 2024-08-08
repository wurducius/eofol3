const { exists, rm, PATH_DERIVED, PATH_DIST, PATH_DIST2 } = require("../../eofol")

const cleanDir = (target) => {
  if (exists(target)) {
    rm(target)
  }
}

const pathsToClean = [PATH_DIST, PATH_DIST2, PATH_DERIVED]

const cleanHot = () => {
  pathsToClean.forEach((pathToClean) => {
    cleanDir(pathToClean)
  })
}

module.exports = cleanHot
