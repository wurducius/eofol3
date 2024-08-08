const { resolve } = require("path")
const {
  PATH_CWD,
  PATH_PAGES,
  PATH_BASE_STYLES_LESS,
  PATH_BASE_STYLES_CSS,
  FILENAME_SUFFIX_PAGE_METADATA,
  DIRNAME_ASSETS,
  DIRNAME_ASSET_JS,
} = require("../../constants")
const { relativizePath, relativizeFontStyle } = require("../../compiler/relativize")
const compileAllStyles = require("../../compiler/style-impl")
const { FILENAME_CORE, DIRNAME_EOFOL_INTERNAL } = require("../../constants/paths")

const requireIfExists = (path) => {
  try {
    return require(path)
    // eslint-disable-next-line no-unused-vars
  } catch (ex) {
    return undefined
  }
}

const metadataDefault = requireIfExists(
  resolve(PATH_CWD, DIRNAME_EOFOL_INTERNAL, "api", "head", `default${FILENAME_SUFFIX_PAGE_METADATA}`),
)
const metadataProjectDefault = requireIfExists(resolve(PATH_PAGES, `default${FILENAME_SUFFIX_PAGE_METADATA}`))

const htmlElement = (tagname, content, attributes) => ({
  type: tagname,
  content,
  attributes,
})

const htmlTemplate = (view) => (body) =>
  compileAllStyles(PATH_BASE_STYLES_CSS, PATH_BASE_STYLES_LESS, "").then((baseStyle) => {
    const metadataPage = requireIfExists(resolve(PATH_PAGES, `${view}${FILENAME_SUFFIX_PAGE_METADATA}`))
    const data = { ...metadataDefault, ...metadataProjectDefault, ...metadataPage }

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
            htmlElement("style", [relativizeFontStyle(data.fontStyle), baseStyle], {}),
          ],
          {},
        ),
        htmlElement(
          "body",
          [
            body,
            htmlElement("noscript", ["You need to enable JavaScript to run this app."], {}),
            htmlElement("script", [], {
              src: relativizePath(`${DIRNAME_ASSETS}/${DIRNAME_ASSET_JS}/${FILENAME_CORE}`),
              async: true,
              defer: true,
            }),
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
  })

module.exports = htmlTemplate
