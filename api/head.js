const { readFileSync } = require("fs")
const { resolve } = require("path")
const { PATH_CWD } = require("../constants/paths")
const data = {
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
  fontStyle:
    '@font-face { font-family: "Roboto"; font-style: normal; font-weight: 400; font-display: swap; src: url(./fonts/Roboto-Regular.ttf) format("truetype"); }',
}

const baseStyle = readFileSync(resolve(PATH_CWD, "api", "base.css")).toString()

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
          htmlElement("script", [], { src: `assets/js/${view}.js`, async: true, defer: true }),
        ],
        {},
      ),
    ],
    {
      lang: "en",
    },
  )

module.exports = htmlTemplate
