import { Attributes, JSONNode, Properties } from "../types"

// @IMPORT-START
import CreateElement from "../create-element"
const { createElement } = CreateElement
// @IMPORT("../create-element")
// @IMPORT-END

const tag =
  (tagname: string) => (content?: JSONNode, classname?: string, attributes?: Attributes, properties?: Properties) =>
    createElement(tagname, content, classname, attributes, properties)

const tagnames = [
  "div",
  "span",
  "a",
  "button",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "code",
  "input",
  "ul",
  "ol",
  "li",
  "img",
  "pre",
  "p",
  "table",
  "select",
  "thead",
  "tbody",
  "td",
  "th",
  "textarea",
]

const a = tag("a")
const div = tag("div")
const p = tag("p")
const h1 = tag("h1")
const h2 = tag("h2")
const h3 = tag("h3")
const h4 = tag("h4")
const h5 = tag("h5")
const h6 = tag("h6")
const button = tag("button")
const img = tag("img")

export default { a, div, p, h1, h2, h3, h4, h5, h6, button, img }
