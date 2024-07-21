const path = require("path")
const { PATH_VIEWS_SRC, EXT_LESS, EXT_CSS } = require("../constants")
const compileAllStyles = require("./style-impl")

const CODE_STYLE_TAG_END = "</style>"

const injectStyles = (htmlPage) => (styles) =>
  htmlPage
    .split(CODE_STYLE_TAG_END)
    .map((htmlPart, i) => (i === 0 ? `${htmlPart} ${styles} ${CODE_STYLE_TAG_END}` : htmlPart))
    .join("")

const compileStyle = (view, stylesSxList) => (htmlPage) =>
  compileAllStyles(
    path.resolve(PATH_VIEWS_SRC, view, `${view}${EXT_CSS}`),
    path.resolve(PATH_VIEWS_SRC, view, `${view}${EXT_LESS}`),
    stylesSxList.join(" "),
  ).then(injectStyles(htmlPage))

module.exports = compileStyle
