const { checkExistsCreate } = require("../util")

const {
  PATH_BUILD,
  PATH_ASSETS,
  PATH_ASSETS_JS,
  PATH_ASSETS_CSS,
  PATH_ASSETS_FONTS,
  PATH_BUILD_INTERNAL,
} = require("../constants")

const touchBuildDirs = () => {
  checkExistsCreate(PATH_BUILD)
  checkExistsCreate(PATH_ASSETS)
  checkExistsCreate(PATH_ASSETS_JS)
  checkExistsCreate(PATH_ASSETS_CSS)
  checkExistsCreate(PATH_ASSETS_FONTS)
  checkExistsCreate(PATH_BUILD_INTERNAL)
}

module.exports = touchBuildDirs
