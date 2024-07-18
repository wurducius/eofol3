import { Attributes, JSONNode, Properties } from "./types"

// @IMPORT-START
import CreateElement from "./create-element"
const { createElement } = CreateElement
// @IMPORT("./create-element")
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

const tags = tagnames.reduce((acc, next) => ({ ...acc, [next]: tag(next) }), {})

const a = tag("a")

export default { a }
