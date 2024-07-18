const fs = require("fs")
const path = require("path")

const { PATH_VIEWS_SRC, EXT_CSS } = require("../constants")

const CODE_STYLE_TAG_END = "</style>"

const compileStyle = (view) => (htmlPage) => {
  const source = path.resolve(PATH_VIEWS_SRC, view, `${view}${EXT_CSS}`)

  if (fs.existsSync(source)) {
    const stylesContent = fs.readFileSync(source).toString()
    return htmlPage
      .split(CODE_STYLE_TAG_END)
      .map((htmlPart, i) => (i === 0 ? `${htmlPart} ${stylesContent}${CODE_STYLE_TAG_END}` : htmlPart))
      .join("")
  } else {
    return undefined
  }
}

module.exports = compileStyle
