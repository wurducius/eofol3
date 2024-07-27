import { Defs, Instances, JSONElement } from "./types"

// @IMPORT-START
import Util from "./util"
const { errorDefNotFound } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import Crypto from "./crypto"
const { generateId } = Crypto
// @IMPORT("./crypto")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { getProps } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import Components from "./components"
const { getEofolComponentType, findEofolComponentDef } = Components
// @IMPORT("./components")
// @IMPORT-END

// @IMPORT-START
import Stateful from "./stateful"
const { getStateStatic, getSetState } = Stateful
// @IMPORT("./stateful)
// @IMPORT-END

const RENDER_CUSTOM_DEFAULT_AS_TAGNAME = "div"
const RENDER_FLAT_DEFAULT_AS_TAGNAME = "div"
const RENDER_STATIC_DEFAULT_AS_TAGNAME = "div"

const initRender = (element: JSONElement, defs: Defs) => {
  const name = getEofolComponentType(element)
  const def = findEofolComponentDef(defs)(name)

  if (!def) {
    errorDefNotFound(name)
  }

  return { name, def }
}

const getAsProp = (element: JSONElement, defaultTagname: string) => element?.attributes?.as ?? defaultTagname

const renderElementWrapper = (rendered: JSONElement | string, as: string, attributes?: Object) => ({
  type: as,
  content: [rendered],
  attributes: attributes ?? undefined,
})

const reduceRendered = (rendered: JSONElement | JSONElement[] | undefined) => {
  if (rendered === undefined) {
    return ""
  } else if (Array.isArray(rendered)) {
    return rendered.join("")
  } else {
    return rendered.toString()
  }
}

const renderEofolCustomElement = (element: JSONElement, instances: Instances, memoCache: any, defs: Defs) => {
  const { name, def } = initRender(element, defs)

  if (!def) {
    return undefined
  }

  let id
  if (element.attributes.id) {
    id = element.attributes.id
  } else {
    id = generateId()
  }

  const as = getAsProp(element, RENDER_CUSTOM_DEFAULT_AS_TAGNAME)
  const props = { ...getProps(element), id }
  const stateImpl = getStateStatic(name, defs)
  const setStateImpl = getSetState(id)

  let rendered
  if (def.renderCase) {
    rendered = reduceRendered(def.renderCase(stateImpl, setStateImpl, props)(stateImpl, setStateImpl, props))
  } else {
    rendered = reduceRendered(def.render(stateImpl, setStateImpl, props))
  }

  instances[id] = {
    name,
    id,
    type: as,
    state: stateImpl,
    props,
  }

  if (def.shouldComponentUpdate) {
    instances[id].renderCache = rendered
  }

  if (def.memo) {
    instances[id].memo = { props, state: stateImpl, rendered }
  }

  return renderElementWrapper(rendered, as, { id })
}

const renderEofolFlatElement = (element: JSONElement, memoCache: any, defs: Defs) => {
  const { def } = initRender(element, defs)
  const props = getProps(element)

  if (!def) {
    return undefined
  }

  const rendered = reduceRendered(def.render(props))
  const as = getAsProp(element, RENDER_FLAT_DEFAULT_AS_TAGNAME)

  if (def.memo) {
    if (!memoCache[def.name]) {
      memoCache[def.name] = {}
    }
    memoCache[def.name][!props ? "undefined" : JSON.stringify(props)] = { rendered }
  }

  return renderElementWrapper(rendered, as)
}

const renderEofolStaticElement = (element: JSONElement, memoCache: any, defs: Defs) => {
  const { def } = initRender(element, defs)

  if (!def) {
    return undefined
  }

  const rendered = reduceRendered(def.render())
  const as = getAsProp(element, RENDER_STATIC_DEFAULT_AS_TAGNAME)

  memoCache[def.name] = { rendered }

  return renderElementWrapper(rendered, as)
}

export default { renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement }
