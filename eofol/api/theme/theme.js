import { resolve } from "path"
import { DIRNAME_EOFOL_INTERNAL, PATH_SRC } from "../../constants/paths"
import { PATH_CWD } from "../../constants"
import mergeDeep from "../../util/merge-deep"

const getTheme = () => {
  const Theme = require(resolve(PATH_SRC, "theme.js"))
  const DefaultTheme = require(resolve(PATH_CWD, DIRNAME_EOFOL_INTERNAL, "styles", "default-theme.js"))
  return mergeDeep(DefaultTheme, Theme)
}

module.exports = getTheme
