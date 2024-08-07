import { Attributes, JSONNode, Properties } from "../types"

// @IMPORT-START
import CreateElement from "../components/create-element"
const { createElement } = CreateElement
// @IMPORT("../components/create-element")
// @IMPORT-END

const tag =
  (tagname: string) => (content?: JSONNode, classname?: string, attributes?: Attributes, properties?: Properties) =>
    createElement(tagname, content, classname, attributes, properties)

const a = tag("a")
const div = tag("div")
const span = tag("span")
const p = tag("p")
const h1 = tag("h1")
const h2 = tag("h2")
const h3 = tag("h3")
const h4 = tag("h4")
const h5 = tag("h5")
const h6 = tag("h6")
const code = tag("code")
const pre = tag("pre")

const table = tag("table")
const thead = tag("thead")
const tbody = tag("tbody")
const td = tag("td")
const th = tag("th")
const tr = tag("tr")
const ul = tag("ul")
const li = tag("li")
const ol = tag("ol")

const button = tag("button")
const img = tag("img")

const input = tag("input")
const textarea = tag("textarea")
const select = tag("select")

export default {
  a,
  div,
  span,
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  code,
  pre,
  table,
  thead,
  tbody,
  td,
  th,
  tr,
  ul,
  li,
  ol,
  button,
  img,
  input,
  textarea,
  select,
}
