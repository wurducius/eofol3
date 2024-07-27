const fs = require("fs")
const { resolve, basename, extname } = require("path")
const { PATH_BUILD } = require("../eofol/constants")
const { prettySize, getDirSize } = require("../eofol/dev-util")

const ANALYZE_DEPTH_DELIMITER = "--"
const ANALYZE_DEPTH_SUFFIX = ">"

const ANALYZE_ABSOLUTE_SIZE_FIXED = 9

const ANALYZE_RELATIVE_SIZE_PRECISION_DEFAULT = 1
let ANALYZE_RELATIVE_SIZE_PRECISION = ANALYZE_RELATIVE_SIZE_PRECISION_DEFAULT
if (process.argv.length >= 3 && process.argv[2] !== undefined) {
  const numberArg = Number(process.argv[2])
  if (Number.isInteger(numberArg) && numberArg >= 0) {
    ANALYZE_RELATIVE_SIZE_PRECISION = numberArg
  }
}

const absoluteSize = (size) => prettySize(size)

const relativeSize = (size, totalSize) => `(${((size / totalSize) * 100).toFixed(ANALYZE_RELATIVE_SIZE_PRECISION)}%)`

const space = () => {
  console.log("")
}

const fixed = (msg, length) => {
  let result = msg
  for (let i = 0; i < length - msg.length; i++) {
    result += " "
  }
  return result
}

const printSize = (size, totalSize) =>
  `${fixed(absoluteSize(size), ANALYZE_ABSOLUTE_SIZE_FIXED)} ${relativeSize(size, totalSize)}`

const log = (type, path, filename, size, depth, totalSize) => {
  console.log(
    `${ANALYZE_DEPTH_DELIMITER.repeat(depth)}${ANALYZE_DEPTH_SUFFIX} ${fixed(`[${type}]`, 6)} ${fixed(filename, 14)} -> ${printSize(size, totalSize)}`,
  )
}

const printCategory = (category, size, totalSize) => {
  if (size > 0) {
    console.log(`${fixed(category, 7)} -> ${printSize(size, totalSize)}`)
  }
}

const section = (title) => {
  console.log(`----------- ${title} -----------`)
}

let parsed = {}

const traverse = (path, depth, totalSize) => {
  if (fs.existsSync(path)) {
    const stat = fs.lstatSync(path)
    if (stat.isDirectory()) {
      const dirSize = getDirSize(path)
      log("DIR", path, basename(path), dirSize, depth, totalSize)
      if (dirSize > 0) {
        space()
        fs.readdirSync(path).forEach((child) => {
          traverse(resolve(path, child), depth + 1, totalSize)
        })
        space()
      }
    } else {
      log("FILE", path, basename(path), stat.size, depth, totalSize)
      const ext = extname(path)
      parsed[ext] = (parsed[ext] ?? 0) + stat.size
    }
  }
}

const sumSize = (stats, ext) => {
  const val = stats[ext]
  if (val) {
    delete stats[ext]
    return val
  } else {
    return 0
  }
}

const sumSizes = (stats, exts) => exts.reduce((acc, next) => acc + sumSize(stats, next), 0)

const totalSize = getDirSize(PATH_BUILD)

console.log("*** Eofol3 bundle analyze ***")
space()
section("   TREE   ")
space()
traverse(PATH_BUILD, 0, totalSize)
space()

section(" SUMMARY  ")
space()
Object.keys(parsed)
  .sort((a, b) => parsed[b] - parsed[a])
  .forEach((ext) => {
    console.log(`${fixed(ext, 6)} -> ${printSize(parsed[ext], totalSize)}`)
  })
space()
section("CATEGORIES")
space()

const pagesSize = sumSizes(parsed, [".html", ".htm"])
const scriptsSize = sumSizes(parsed, [".js", ".gz"])
const stylesSize = sumSizes(parsed, [".css"])
const imagesSize = sumSizes(parsed, [
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".gif",
  ".webp",
  ".apng",
  ".tiff",
  ".bmp",
  ".ico",
  ".heif",
])
const fontsSize = sumSizes(parsed, [".ttf", ".otf", ".woff", ".woff2", ".eot"])
const otherSize = Object.keys(parsed).reduce((acc, next) => acc + parsed[next], 0)

printCategory("Pages", pagesSize, totalSize)
printCategory("Scripts", scriptsSize, totalSize)
printCategory("Styles", stylesSize, totalSize)
printCategory("Images", imagesSize, totalSize)
printCategory("Fonts", fontsSize, totalSize)
printCategory("Other", otherSize, totalSize)

space()
console.log("----------------------------------")
space()
console.log(`TOTAL SIZE -> ${absoluteSize(totalSize)}`)
