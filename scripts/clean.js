const fs = require("fs")

const { PATH_DERIVED, PATH_BUILD, PATH_DIST, PATH_DIST2 } = require("../eofol/constants")

const cleanDir = (target) => {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true })
  }
}

cleanDir(PATH_DIST)
cleanDir(PATH_DIST2)
cleanDir(PATH_DERIVED)
cleanDir(PATH_BUILD)
