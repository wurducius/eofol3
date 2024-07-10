const fs = require("fs")
const path = require("path")

const { PATH_VIEWS_SRC } = require("../constants/paths")
const { EXT_CSS } = require("../constants/common")

const compileStyle = (view) => (htmlPage) => {
  //breakpoints.forEach(({ name: mutation }) => {
  const mutation = "lg"
  const source = path.resolve(PATH_VIEWS_SRC, view, `${view}-${mutation}${EXT_CSS}`)

  if (fs.existsSync(source)) {
    const stylesContent = fs.readFileSync(source).toString()
    return htmlPage
      .split("</style>")
      .map((htmlPart, i) => (i === 0 ? `${htmlPart} ${stylesContent}</style>` : htmlPart))
      .join("")
  } else {
    return undefined
  }
  // })
}

module.exports = compileStyle
