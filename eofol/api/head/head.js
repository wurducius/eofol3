const { readFileSync } = require("fs")
const { resolve } = require("path")
const {
  PATH_PAGES,
  PATH_BASE_STYLES,
  FILENAME_SUFFIX_PAGE_METADATA,
  DIRNAME_ASSETS,
  DIRNAME_ASSET_JS,
} = require("../../constants")
const { relativizePath, relativizeStylesheet, relativizeFontStyle } = require("../../compiler/relativize")

const baseStyle = readFileSync(PATH_BASE_STYLES).toString()

// @TODO extract from env
const metadataDefault = require(resolve(PATH_PAGES, `default${FILENAME_SUFFIX_PAGE_METADATA}`))

const htmlElement = (tagname, content, attributes) => ({
  type: tagname,
  content,
  attributes,
})

const htmlTemplate = (body, view) => {
  const metadataPage = require(resolve(PATH_PAGES, `${view}${FILENAME_SUFFIX_PAGE_METADATA}`))
  const data = { ...metadataDefault, ...metadataPage }

  return htmlElement(
    "html",
    [
      htmlElement(
        "head",
        [
          htmlElement("meta", [], { charset: "UTF-8" }),
          htmlElement("meta", [], {
            name: "viewport",
            content: "width=device-width, initial-scale=1, shrink-to-fit=no",
          }),
          htmlElement("meta", [], { name: "theme-color", content: data.themeColor }),
          htmlElement("meta", [], { name: "description", content: data.description }),
          htmlElement("meta", [], { property: "og:description", content: data.descriptionOg }),
          htmlElement("meta", [], { name: "keywords", content: data.keywords }),
          htmlElement("meta", [], { name: "author", content: data.author }),
          htmlElement("meta", [], { property: "og:image", content: relativizePath(data.imageOg) }),
          htmlElement("meta", [], { property: "og:image:type", content: data.imageTypeOg }),
          htmlElement("meta", [], { property: "og:image:width", content: data.imageWidthOg }),
          htmlElement("meta", [], { property: "og:image:height", content: data.imageHeightOg }),
          htmlElement("link", [], { rel: "icon", href: relativizePath(data.favicon) }),
          htmlElement("link", [], { rel: "apple-touch-icon", href: relativizePath(data.appleTouchIcon) }),
          htmlElement("link", [], { rel: "manifest", href: relativizePath(data.manifest) }),
          htmlElement("title", [data.title], {}),
          htmlElement("style", [relativizeFontStyle(data.fontStyle), relativizeStylesheet(baseStyle)], {}),
        ],
        {},
      ),
      htmlElement(
        "body",
        [
          body,
          htmlElement("noscript", ["You need to enable JavaScript to run this app."], {}),
          htmlElement("script", [], {
            src: relativizePath(`${DIRNAME_ASSETS}/${DIRNAME_ASSET_JS}/${view}.js`),
            async: true,
            defer: true,
          }),
        ],
        {},
      ),
    ],
    {
      lang: "en",
    },
  )
}

module.exports = htmlTemplate
