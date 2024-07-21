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
  // @ts-ignore
  const styleStr = Object.keys(styleObj).reduce((acc, next) => `${acc} ${next}: ${styleObj[next]};`, "")
  const styleContent = `${selector || ""} { ${styleStr} } `
  const hash = `e${getHash(styleContent).toString()}`
  // @ts-ignore
  if (!cache.includes(hash)) {
    const style = (prefix || ".") + hash + styleContent
    if (isBrowser()) {
      document.styleSheets.item(0)?.insertRule(style)
    } else {
      compileCache = compileCache + style
      /*
      const targetDir = path.resolve("dist", "views")
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir)
      }
      const target = path.resolve("dist", "views", "index.css")
      if (!fs.existsSync(target)) {
        fs.writeFileSync(target, "")
      }
      fs.appendFileSync(target, style)
      */
    }

    cache.push(hash)
  }

  return hash
}

export default { sx, getCompileCache, clearCompileCache }
