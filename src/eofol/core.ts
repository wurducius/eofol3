type VDOMType = "tag" | "custom"

type HTMLTag = any

type Handler = Function

interface VDOM {
  type: VDOMType
  name: string
  children?: VDOM[]
  id?: string
}

interface Instance {
  name: string
  id: string
  as: HTMLTag
  type: string
  state?: Object
}

interface Def {
  type: string
  name: string
  render: Handler
  initialState?: Object
  effect?: Handler | Handler[]
  subscribe?: string | string[]
  cases?: Handler
}

const EOFOL_COMPONENT_TYPE_CUSTOM = "custom"
const EOFOL_COMPONENT_TYPE_FLAT = "flat"
const EOFOL_COMPONENT_TYPE_STATIC = "static"

let vdom: VDOM = { type: "tag", name: "initial" }
let instances: Instance[] = []
const customDefs: Def[] = []
const flatDefs: Def[] = []
const staticDefs: Def[] = []

const EOFOL_ERROR_MSG_PREFIX = "EOFOL ERROR - "

const errorRuntime = (msg: string) => {
  console.log(`${EOFOL_ERROR_MSG_PREFIX}${msg}`)
}

const isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined"

const reduceHTMLProps = (props: any, prefix?: string, suffix?: string) =>
  props
    ? Object.keys(props).reduce((acc, next) => {
        const val = props[next].toString().replaceAll('"', "'")
        return `${acc} ${next}="${prefix ?? ""}${val}${suffix ?? ""}"`
      }, "")
    : ""

const findGeneralDef = (generalDefs: any) => (tagname: string) => generalDefs.find((def: any) => def.name === tagname)
const findCustomDef = findGeneralDef(customDefs)
const findFlatDef = findGeneralDef(flatDefs)
const findStaticDef = findGeneralDef(staticDefs)

const findDef = (tagname: string) => findCustomDef(tagname) || findFlatDef(tagname) || findStaticDef(tagname)

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

const defineCustomComponent = (componentDef: any) => {
  customDefs.push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_CUSTOM })
  return componentDef
}
const defineFlatComponent = (componentDef: any) => {
  flatDefs.push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_FLAT })
  return componentDef
}
const defineStaticComponent = (componentDef: any) => {
  staticDefs.push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_STATIC })
  return componentDef
}

const initEofol = () => {
  const htmlPageRaw = isBrowser() ? window.location.pathname.split("/").pop() : ""
  const page = (!htmlPageRaw || htmlPageRaw?.length === 0 ? "index" : htmlPageRaw).split(".")[0]

  return (
    isBrowser() &&
    fetch(`./eofol/${page}-eofol-internals.json`)
      .then((res) => res.json())
      .then((res) => {
        vdom = res.vdom
        instances = res.instances
      })
  )
}

const renderEofolElement = (name: string, props: any, id: string) => {
  const def = findDef(name)
  if (def) {
    const type = def.type
    let result
    switch (type) {
      case EOFOL_COMPONENT_TYPE_CUSTOM: {
        const thisInstance = instances.find((instance: { id: string }) => instance.id === id)
        const state = thisInstance?.state
        result = def.render(
          state,
          (nextState: any) => {
            console.log("Dynamically compiled setState fired!")
            // @TODO Dynamically compiled setState
            if (thisInstance) {
              thisInstance.state = nextState
              forceRerender()
            } else {
              errorRuntime(`Couldn't find component instance for name: ${name}.`)
            }
          },
          props,
        )
        break
      }
      case EOFOL_COMPONENT_TYPE_FLAT: {
        result = def.render(props)
        break
      }
      case EOFOL_COMPONENT_TYPE_STATIC: {
        result = def.render()
        break
      }
      default: {
        errorRuntime(`Invalid Eofol component type: ${type} for component with name: ${name}.`)
        result = undefined
      }
    }
    return result
  } else {
    errorRuntime(`Couldn't find def for Eofol element with name = ${name}.`)
    return undefined
  }
}

const forceRerender = () => {
  // @TODO Instead rather rerender VDOM from top level down
  instances?.forEach((child: any) => {
    const { id, name, props } = child
    const target = isBrowser() ? document.getElementById(id) : null
    if (target) {
      target.innerHTML = renderEofolElement(name, props, id)
    }
  })
}

initEofol()

const generateString = (length: number) => () =>
  Array(length)
    .fill("")
    .map((v) => Math.random().toString(36).charAt(2))
    .join("")
const generateId = generateString(17)

const registerServiceworker = () => {
  if (isBrowser() && "serviceWorker" in navigator) {
    navigator.serviceWorker.register(`./service-worker.js`)
  }
}

registerServiceworker()

///////////////////////////////////////////////////////////////////////////////
////////////////////////////   CORE    ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const EOFOL_CUSTOM_COMPONENT_TAGNAME = "custom"
const EOFOL_FLAT_COMPONENT_TAGNAME = "flat"
const EOFOL_STATIC_COMPONENT_TAGNAME = "static"

const EOFOL_COMPONENT_ATTRIBUTE_TYPE = "name"

// -------------------------------------------

const getEofolComponentType = (element: any) => element && element.attributes[EOFOL_COMPONENT_ATTRIBUTE_TYPE]

const findEofolComponentDef = (defs: any) => (name: any) =>
  defs.find((componentDef: any) => componentDef[EOFOL_COMPONENT_ATTRIBUTE_TYPE] === name)

const isEofolCustomElement = (element: any) => element && element.type === EOFOL_CUSTOM_COMPONENT_TAGNAME

const isEofolFlatElement = (element: any) => element && element.type === EOFOL_FLAT_COMPONENT_TAGNAME

const isEofolStaticElement = (element: any) => element && element.type === EOFOL_STATIC_COMPONENT_TAGNAME

const validateEofolCustomElement = (element: any) => {
  if (Array.isArray(element.content) && element.content.length > 0) {
    errorRuntime(
      `Eofol validation error: Custom eofol component cannot have children: Component ${getEofolComponentType(
        element,
      )}`,
    )
  }
}

const notProps = ["name", "as"]

const getProps = (element: any) => {
  const props = structuredClone(element.attributes)
  Object.keys(props)
    .filter((key) => notProps.reduce((acc, next) => acc || key === next, false))
    .forEach((key) => delete props[key])
  return props
}

///////////////////////////////////////////////////////////////////////////////
//////////////////////////     CUSTOM       ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const renderEofolCustomElement = (element: any, instances: any, defs: any) => {
  const name = getEofolComponentType(element)
  const def = findEofolComponentDef(defs)(name)
  const props = getProps(element)

  if (!def) {
    errorRuntime(`Cannot render custom eofol element: definition not found for component type: "${name}"`)
  }

  let id
  if (element.attributes.id) {
    id = element.attributes.id
  } else {
    id = generateId()
  }

  const as = element?.attributes?.as ?? "div"
  const stateImpl = def.initialState ? { ...def.initialState } : undefined

  instances.push({
    name,
    id,
    state: stateImpl,
    props,
    as,
  })

  return {
    type: as,
    content: [
      def.render(
        stateImpl,
        (nextState: any) => {
          console.log("Statically compiled setState fired!")
          // @TODO Statically compiled setState
          const thisInstance = instances.find((instance: any) => instance.id === id)
          if (thisInstance) {
            thisInstance.state = nextState
            // @TODO import
            // forceRerender();
            console.log("forceRerender()")
          } else {
            // @TODO Extract
            console.log(`EOFOL ERROR - Couldn't find component instance for name: ${name}.`)
          }
        },
        props,
      ),
    ],
    attributes: {
      id,
    },
  }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////     FLAT    ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const renderEofolFlatElement = (element: any, defs: any) => {
  const name = getEofolComponentType(element)
  const def = findEofolComponentDef(defs)(name)
  const props = getProps(element)

  if (!def) {
    errorRuntime(`Cannot render custom eofol element: definition not found for component type: "${name}"`)
  }

  // @TODO
  const as = element?.attributes?.as ?? "h5"

  return {
    type: as,
    content: [def.render(props)],
    attributes: {},
  }
}

///////////////////////////////////////////////////////////////////////////////
//////////////////////////    STATIC    ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const renderEofolStaticElement = (element: any, defs: any) => {
  const name = getEofolComponentType(element)
  const def = findEofolComponentDef(defs)(name)

  if (!def) {
    errorRuntime(`Cannot render custom eofol element: definition not found for component type: "${name}"`)
  }

  // @TODO
  // const as = element?.attributes?.as ?? "h5";

  const rendered = def.render()
  const reduced = Array.isArray(rendered) ? rendered.join("") : rendered

  return {
    // @TODO
    //  type: "static",
    type: "div",
    content: [reduced],
    // attributes: {},
  }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default {
  defineCustomComponent,
  defineFlatComponent,
  defineStaticComponent,
  isBrowser,
  forceRerender,
  createElement,
  generateId,
  vdom,
  instances,
  customDefs,
  flatDefs,
  staticDefs,
  getEofolComponentType,
  validateEofolCustomElement,
  isEofolCustomElement,
  isEofolFlatElement,
  isEofolStaticElement,
  renderEofolCustomElement,
  renderEofolFlatElement,
  renderEofolStaticElement,
}
