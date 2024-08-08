const { resolve } = require("path")
const {
  PATH_CWD,
  DIRNAME_EOFOL_INTERNAL,
  FILENAME_DEFAULT_THEME,
  FILENAME_THEME,
  PATH_SRC,
  PATH_VIEWS_SRC,
} = require("../../constants")
const mergeDeep = require("../../util/merge-deep")

const getTheme = (view) => {
  const Theme = require(resolve(PATH_SRC, FILENAME_THEME))
  const DefaultTheme = require(resolve(PATH_CWD, DIRNAME_EOFOL_INTERNAL, "api", "theme", FILENAME_DEFAULT_THEME))
  const ThemeImpl = mergeDeep(DefaultTheme, Theme)
  if (view) {
    const ViewTheme = require(resolve(PATH_VIEWS_SRC, view, FILENAME_THEME))
    return mergeDeep(ThemeImpl, ViewTheme)
  } else {
    return ThemeImpl
  }
}

module.exports = getTheme
