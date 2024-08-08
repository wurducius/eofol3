const fs = require("fs")
const { resolve } = require("path")
const {
  PATH_CWD,
  DIRNAME_EOFOL_INTERNAL,
  FILENAME_DEFAULT_THEME,
  FILENAME_THEME,
  PATH_SRC,
  PATH_VIEWS_SRC,
} = require("../../constants")
const { mergeDeep } = require("../../util")

const PATH_THEME_DEFAULT = resolve(PATH_CWD, DIRNAME_EOFOL_INTERNAL, "api", "theme", FILENAME_DEFAULT_THEME)

const PATH_THEME_GLOBAL = resolve(PATH_SRC, FILENAME_THEME)

const getTheme = (view) => {
  let Theme = {}
  if (fs.existsSync(PATH_THEME_GLOBAL)) {
    Theme = require(PATH_THEME_GLOBAL)
  }
  const DefaultTheme = require(PATH_THEME_DEFAULT)
  const ThemeImpl = mergeDeep(DefaultTheme, Theme)
  if (view) {
    let ViewTheme = {}
    const viewThemePath = resolve(PATH_VIEWS_SRC, view, FILENAME_THEME)
    if (fs.existsSync(viewThemePath)) {
      ViewTheme = require(viewThemePath)
    }
    return mergeDeep(ThemeImpl, ViewTheme)
  } else {
    return ThemeImpl
  }
}

module.exports = getTheme
