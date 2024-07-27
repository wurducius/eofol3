const path = require("path")
const { checkExistsCreate } = require("../util")

const { PATH_BUILD, PATH_ASSETS, PATH_ASSETS_JS, PATH_ASSETS_CSS } = require("../constants")

const touchBuildDirs = () => {
  checkExistsCreate(PATH_BUILD)
  checkExistsCreate(PATH_ASSETS)
  checkExistsCreate(PATH_ASSETS_JS)
  checkExistsCreate(PATH_ASSETS_CSS)
  checkExistsCreate(path.resolve(PATH_ASSETS, "media"))
  checkExistsCreate(path.resolve(PATH_ASSETS, "media", "images"))
  checkExistsCreate(path.resolve(PATH_ASSETS, "media", "icons"))
  checkExistsCreate(path.resolve(PATH_ASSETS, "media", "fonts"))
}

module.exports = touchBuildDirs
