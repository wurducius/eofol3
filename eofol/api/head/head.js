const { readFileSync } = require("fs")
const { resolve } = require("path")

const { PATH_CWD } = require("../../constants")
const { PATH_PAGES } = require("../../constants/paths")

const baseStyle = readFileSync(resolve(PATH_CWD, "eofol", "api", "head", "base.css")).toString()

const FILENAME_SUFFIX_PAGE_METADATA = "-metadata.js"

// @TODO extract from env and above also extract base.css somewhere
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
          htmlElement("meta", [], { property: "og:image", content: data.imageOg }),
          htmlElement("meta", [], { property: "og:image:type", content: data.imageTypeOg }),
          htmlElement("meta", [], { property: "og:image:width", content: data.imageWidthOg }),
          htmlElement("meta", [], { property: "og:image:height", content: data.imageHeightOg }),
          htmlElement("link", [], { rel: "icon", href: data.favicon }),
          htmlElement("link", [], { rel: "apple-touch-icon", href: data.appleTouchIcon }),
          htmlElement("link", [], { rel: "manifest", href: data.manifest }),
          htmlElement("title", [data.title], {}),
          htmlElement("style", [data.fontStyle, baseStyle], {}),
        ],
        {},
      ),
      htmlElement(
        "body",
        [
          body,
          htmlElement("noscript", ["You need to enable JavaScript to run this app."], {}),
          htmlElement("script", [], { src: `/assets/js/${view}.js`, async: true, defer: true }),
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
