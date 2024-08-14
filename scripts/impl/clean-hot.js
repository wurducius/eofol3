const { exists, rm, PATH_DIST, PATH_DIST2 } = require("../../eofol")

const cleanDir = (target) => {
  if (exists(target)) {
    rm(target)
  }
}

const pathsToClean = [PATH_DIST, PATH_DIST2]

const cleanHot = () => {
  pathsToClean.forEach((pathToClean) => {
    cleanDir(pathToClean)
  })
}

module.exports = cleanHot
