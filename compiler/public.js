const fs = require("fs")
const path = require("path")
const { PATH_PUBLIC, FILENAME_FAVICON, PATH_BUILD } = require("../constants/paths")
const { EXT_HTML, EXT_CSS, EXT_JPG, EXT_JPEG, EXT_PNG } = require("../constants/common")
const compileImg = require("./img")

const copyPublicDir = () => {
  fs.readdirSync(PATH_PUBLIC, {
    recursive: true,
  })
    .flat()
    .forEach(async (x) => {
      if (!x.includes(".") || x.endsWith(EXT_HTML) || x.endsWith(EXT_CSS)) {
        return
      }

      const publicFileContent = fs.readFileSync(path.resolve(PATH_PUBLIC, x))

      if (x.includes(FILENAME_FAVICON)) {
        fs.writeFileSync(path.resolve(PATH_BUILD, x), publicFileContent)
        return
      }

      if (x.includes(EXT_JPG) || x.includes(EXT_JPEG) || x.includes(EXT_PNG)) {
        compileImg(x, publicFileContent)
      } else {
        fs.writeFileSync(path.resolve(PATH_BUILD, x), publicFileContent)
      }
    })
}

module.exports = copyPublicDir
