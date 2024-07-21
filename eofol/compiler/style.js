const fs = require("fs")
const path = require("path")
const less = require("less")
const { PATH_VIEWS_SRC, EXT_LESS, EXT_CSS } = require("../constants")
const { relativizeStylesheet } = require("./relativize")

const CODE_STYLE_TAG_END = "</style>"

const injectStyles = (htmlPage, styles) =>
  htmlPage
    .split(CODE_STYLE_TAG_END)
    .map((htmlPart, i) => (i === 0 ? `${htmlPart} ${relativizeStylesheet(styles)}${CODE_STYLE_TAG_END}` : htmlPart))
    .join("")

const compileStyle = (view, stylesSxList) => (htmlPage) => {
  const lessPath = path.resolve(PATH_VIEWS_SRC, view, `${view}${EXT_LESS}`)
  const cssPath = path.resolve(PATH_VIEWS_SRC, view, `${view}${EXT_CSS}`)
  const stylesSx = stylesSxList.join(" ")

  if (fs.existsSync(lessPath)) {
    return less
      .render(fs.readFileSync(lessPath).toString(), {})
      .then((derivedStyles) =>
        injectStyles(
          htmlPage,
          derivedStyles.css + (fs.existsSync(cssPath) ? fs.readFileSync(cssPath).toString() : "") + stylesSx,
        ),
      )
  } else if (fs.existsSync(cssPath)) {
    return injectStyles(htmlPage, fs.readFileSync(cssPath).toString() + stylesSx)
  } else {
    return injectStyles(htmlPage, stylesSx)
  }
}

module.exports = compileStyle
