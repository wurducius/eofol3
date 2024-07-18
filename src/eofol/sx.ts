// @IMPORT-START
import Common from "./common"
const { isBrowser } = Common
// @IMPORT("./common")
// @IMPORT-END

// const seed = new Date().getMilliseconds()

const seed = 69

function murmurhash2_32_gc(str: string, seed: number) {
  var l = str.length,
    h = seed ^ l,
    i = 0,
    k

  while (l >= 4) {
    k =
      (str.charCodeAt(i) & 255) |
      ((str.charCodeAt(++i) & 255) << 8) |
      ((str.charCodeAt(++i) & 255) << 16) |
      ((str.charCodeAt(++i) & 255) << 24)

    k = (k & 65535) * 1540483477 + ((((k >>> 16) * 1540483477) & 65535) << 16)
    k ^= k >>> 24
    k = (k & 65535) * 1540483477 + ((((k >>> 16) * 1540483477) & 65535) << 16)

    h = ((h & 65535) * 1540483477 + ((((h >>> 16) * 1540483477) & 65535) << 16)) ^ k

    l -= 4
    ++i
  }

  switch (l) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 255) << 16
    case 2:
      h ^= (str.charCodeAt(i + 1) & 255) << 8
    case 1:
      h ^= str.charCodeAt(i) & 255
      h = (h & 65535) * 1540483477 + ((((h >>> 16) * 1540483477) & 65535) << 16)
  }

  h ^= h >>> 13
  h = (h & 65535) * 1540483477 + ((((h >>> 16) * 1540483477) & 65535) << 16)
  h ^= h >>> 15

  return h >>> 0
}

const getHash = (styleStr: string) => murmurhash2_32_gc(styleStr, seed)

const cache: string[] = []

let compileCache = ""

const getCompileCache = () => compileCache

const clearCompileCache = () => {
  compileCache = ""
}

const sx = (styleObj: Object, selector?: string, prefix?: string) => {
  // @ts-ignore
  const styleStr = Object.keys(styleObj).reduce((acc, next) => acc + " " + next + ": " + styleObj[next] + ";", "")
  const styleContent = (selector || "") + " { " + styleStr + " } "
  const hash = "e" + getHash(styleContent).toString()
  // @ts-ignore
  if (!cache.includes(hash)) {
    const style = (prefix || ".") + hash + styleContent
    if (isBrowser()) {
      document.styleSheets.item(0)?.insertRule(style)
    } else {
      console.log("SX -> " + style)
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
