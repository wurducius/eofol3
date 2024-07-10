const { HTMLToJSON } = require("html-to-json-parser")

const { isVerbose } = require("../constants/compile")
const { die } = require("../util/common")
const { msgStepParser } = require("./log")

const fontStyle =
  '@font-face { font-family: "Roboto" font-style: normal; font-weight: 400; font-display: swap; src: url(./fonts/Roboto-Regular.ttf) format("truetype"); }'

const head = {
  title: "Eofol3 app",
  themeColor: "#000000",
  description: "All inclusive web framework with zero configuration, batteries included!",
  descriptionOg: "All inclusive web framework with zero configuration, batteries included!",
  keywords: "JS,Frontend framework",
  author: "Jakub Eliáš",
  imageOg: "logo-lg.png",
  imageTypeOg: "image/png",
  imageWidthOg: "512",
  imageHeightOg: "512",
  favicon: "favicon.png",
  appleTouchIcon: "logo-sm.png",
  manifest: "manifest.json",
}

const htmlElement = (tagname, content, attributes) => ({
  type: tagname,
  content,
  attributes,
})

const htmlTemplate = (body, view) =>
  htmlElement(
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
          htmlElement("meta", [], { name: "theme-color", content: head.themeColor }),
          htmlElement("meta", [], { name: "description", content: head.description }),
          htmlElement("meta", [], { property: "og:description", content: head.descriptionOg }),
          htmlElement("meta", [], { name: "keywords", content: head.keywords }),
          htmlElement("meta", [], { name: "author", content: head.author }),
          htmlElement("meta", [], { property: "og:image", content: head.imageOg }),
          htmlElement("meta", [], { property: "og:image:type", content: head.imageTypeOg }),
          htmlElement("meta", [], { property: "og:image:width", content: head.imageWidthOg }),
          htmlElement("meta", [], { property: "og:image:height", content: head.imageHeightOg }),
          htmlElement("link", [], { rel: "icon", href: head.favicon }),
          htmlElement("link", [], { rel: "apple-touch-icon", href: head.appleTouchIcon }),
          htmlElement("link", [], { rel: "manifest", href: head.manifest }),
          htmlElement("title", [head.title], {}),
          htmlElement("style", [fontStyle], {}),
        ],
        {},
      ),
      htmlElement(
        "body",
        [
          body,
          htmlElement("noscript", ["You need to enable JavaScript to run this app."], {}),
          htmlElement("script", [], { src: `assets/js/${view}.js`, async: true, defer: true }),
        ],
        {},
      ),
    ],
    {
      lang: "en",
    },
  )

const parseHTMLToJSON = (view) => (res) =>
  HTMLToJSON(res.toString(), false)
    .then((res) => {
      if (isVerbose) {
        msgStepParser("Parse successful")
      }
      return htmlTemplate(res, view)
    })
    .catch((ex) => {
      die("Parse error", ex)
    })

module.exports = parseHTMLToJSON
