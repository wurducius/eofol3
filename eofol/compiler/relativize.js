const { env } = require("../../config")
const { BASE_URL } = env

const relativizePath = (url) => `${BASE_URL}${url}`

const relativizeStylesheet = (styleContent) => styleContent.replaceAll('url("./', `url("${BASE_URL}`)

const relativizeFontStyle = (fontStyleContent) =>
  fontStyleContent
    .split("src: url(")
    .map((part, i) => {
      if (i === 0) {
        return part
      } else {
        return part
          .split("/")
          .map((innerPart, j) => {
            if (j === 0) {
              return BASE_URL
            } else {
              return innerPart
            }
          })
          .join("/")
      }
    })
    .join("src: url(")

const relativizeHtml = (htmlContent) =>
  htmlContent.replaceAll('src="./', `src="${BASE_URL}`).replaceAll("src='./", `src='${BASE_URL}`)

module.exports = { relativizePath, relativizeStylesheet, relativizeFontStyle, relativizeHtml }
