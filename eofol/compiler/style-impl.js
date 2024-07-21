const fs = require("fs")

const less = require("less")

const { relativizeStylesheet } = require("./relativize")

const compileLess = (lessPath) =>
  fs.existsSync(lessPath)
    ? less.render(fs.readFileSync(lessPath).toString(), { compress: true, lint: true, paths: ["eofol/styles"] })
    : new Promise((resolve) => resolve(undefined))
const compileCss = (cssPath) => fs.readFileSync(cssPath).toString()

const compileAllStyles = async (cssPath, lessPath, sxStyles) => {
  const lessResult = await compileLess(lessPath)
  return relativizeStylesheet(
    `${lessResult ? lessResult.css : ""} ${fs.existsSync(cssPath) ? compileCss(cssPath) : ""} ${sxStyles ?? ""}`,
  )
}

module.exports = compileAllStyles
