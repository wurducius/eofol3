// @IMPORT-START
import Common from "./common"
const { findDef } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import RenderDynamic from "./render-dynamic"
const { renderEofolElement } = RenderDynamic
// @IMPORT("./render-dynamic")
// @IMPORT-END

const reduceHTMLProps = (props: any, prefix?: string, suffix?: string) =>
  props
    ? Object.keys(props).reduce((acc, next) => {
        const val = props[next].toString().replaceAll('"', "'")
        return `${acc} ${next}="${prefix ?? ""}${val}${suffix ?? ""}"`
      }, "")
    : ""

const getContentHTML = (content: any): any => {
  if (!content) {
    return ""
  } else if (Array.isArray(content)) {
    return content.reduce((acc, next) => acc + getContentHTML(next), "")
  } else if (typeof content === "string") {
    return content
  } else {
    return content
  }
}

function createElement(
  tagname: string,
  content?: any,
  classname?: string,
  attributes?: any,
  properties?: any,
  props?: any,
) {
  // @TODO remove double findDef call
  const def = findDef(tagname)
  if (def) {
    // @TODO finish
    const id = attributes && attributes.id
    return renderEofolElement(tagname, props, id)
  } else {
    const classnameHTML = classname ? ` class='${classname}'` : ""
    const attributesHTML = reduceHTMLProps(attributes)
    const propertiesHTML = reduceHTMLProps(properties, "(", ")()")
    const contentHTML = getContentHTML(content)
    return `<${tagname}${classnameHTML}${attributesHTML}${propertiesHTML}>${contentHTML}</${tagname}>`
  }
}

export default { createElement }
