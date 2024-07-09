// @IMPORT-START
import Common from "./common"
const { findDef } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import RenderDynamic from "./render-dynamic"
import { Attributes, JSONNode, Properties, Props, StringRecord } from "./types"
const { renderEofolElement } = RenderDynamic
// @IMPORT("./render-dynamic")
// @IMPORT-END

const reduceHTMLProps = (props: StringRecord | undefined, prefix?: string, suffix?: string) =>
  props
    ? Object.keys(props).reduce((acc, next) => {
        // @ts-ignore
        const val = props[next].toString().replaceAll('"', "'")
        return `${acc} ${next}="${prefix ?? ""}${val}${suffix ?? ""}"`
      }, "")
    : ""

const getContentHTML = (content: JSONNode | undefined): JSONNode => {
  if (!content) {
    return ""
  } else if (Array.isArray(content)) {
    return content.reduce((acc, next) => acc + getContentHTML(next).toString(), "")
  } else {
    return content
  }
}

const renderTagElement = (
  tagname: string,
  content?: JSONNode,
  classname?: string,
  attributes?: Attributes,
  properties?: Properties,
) => {
  const classnameHTML = classname ? ` class='${classname}'` : ""
  const attributesHTML = reduceHTMLProps(attributes)
  const propertiesHTML = reduceHTMLProps(properties, "(", ")()")
  const contentHTML = getContentHTML(content)
  return `<${tagname}${classnameHTML}${attributesHTML}${propertiesHTML}>${contentHTML}</${tagname}>`
}

const createElement = (
  tagname: string,
  content?: JSONNode,
  classname?: string,
  attributes?: Attributes,
  properties?: Properties,
  props?: Props,
) => {
  const def = findDef(tagname)
  if (def) {
    const id = attributes && attributes.id ? attributes.id : undefined
    return renderEofolElement(tagname, props, id, def)
  } else {
    return renderTagElement(tagname, content, classname, attributes, properties)
  }
}

export default { createElement }
