const less = require("less")

const { relativizeStylesheet } = require("./relativize")
const { exists, read } = require("../util/fs")

const compileLess = (lessPath) =>
  exists(lessPath)
    ? less.render(read(lessPath).toString(), { compress: true, lint: true, paths: ["eofol/styles"] })
    : new Promise((resolve) => resolve(undefined))
const compileCss = (cssPath) => read(cssPath).toString()

const compileAllStyles = async (cssPath, lessPath, sxStyles) => {
  const lessResult = await compileLess(lessPath)
  return relativizeStylesheet(
    `${lessResult ? lessResult.css : ""} ${exists(cssPath) ? compileCss(cssPath) : ""} ${sxStyles ?? ""}`,
  )
}

module.exports = compileAllStyles
