// @IMPORT-START
import Common from "./common"
const { isBrowser } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import Crypto from "./crypto"
const { getHash } = Crypto
// @IMPORT("./crypto")
// @IMPORT-END

const cache: string[] = []

let compileCache = ""

const getCompileCache = () => compileCache

const clearCompileCache = () => {
  compileCache = ""
}

const sx = (styleObj: Object, selector?: string, prefix?: string) => {
  // @ts-expect-error tsconfig.lib mismatch
  const styleStr = Object.keys(styleObj).reduce((acc, next) => `${acc} ${next}: ${styleObj[next]};`, "")
  const styleContent = `${selector || ""} { ${styleStr} } `
  const hash = `e${getHash(styleContent).toString()}`
  // @ts-expect-error tsconfig.lib mismatch
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
