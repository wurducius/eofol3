// @IMPORT-START
import Common from "../eofol/common"
const { isBrowser } = Common
// @IMPORT("../eofol/common")
// @IMPORT-END

// @IMPORT-START
import Crypto from "../util/crypto"
const { getHash } = Crypto
// @IMPORT("../util/crypto")
// @IMPORT-END

const cache: string[] = []

let compileCache = ""

const getCompileCache = () => compileCache

const clearCompileCache = () => {
  compileCache = ""
}

const sx = (styleObj: Object, selector?: string, prefix?: string) => {
  // @ts-ignore
  const styleStr = Object.keys(styleObj).reduce((acc, next) => `${acc} ${next}: ${styleObj[next]};`, "")
  const styleContent = `${selector || ""} { ${styleStr} } `
  const hash = `e${getHash(styleContent).toString()}`
  if (!cache.includes(hash)) {
    const style = (prefix || ".") + hash + styleContent
    if (isBrowser()) {
      document.styleSheets.item(0)?.insertRule(style)
    } else {
      compileCache = compileCache + style
    }

    cache.push(hash)
  }

  return hash
}

export default { sx, getCompileCache, clearCompileCache }
