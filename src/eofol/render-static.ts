import { DefCustom, DefFlat, Defs, DefSaved, DefStatic, DefVirtual, Instances, JSONElement } from "./types"

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
// @IMPORT("./stateful")
// @IMPORT-END

// @IMPORT-START
import Constants from "./constants"
const { ID_PLACEHOLDER, CUSTOM_DEFAULT_AS_TAGNAME, FLAT_DEFAULT_AS_TAGNAME, STATIC_DEFAULT_AS_TAGNAME } = Constants
// @IMPORT("./constants")
// @IMPORT-END

const initRender = (element: JSONElement, defs: Defs) => {
  const name = getEofolComponentType(element)
  const def = findEofolComponentDef(defs)(name)

  if (!def) {
    errorDefNotFound(name)
  }

  return { name, def }
}

const getAsPropStatic = (element: JSONElement, defaultTagname: string) => element?.attributes?.as ?? defaultTagname

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
  const { name, def: defx } = initRender(element, defs)
  const def = defx as (DefCustom & DefSaved) | undefined

  if (!def) {
    return undefined
  }

  let id
  if (element.attributes.id) {
    id = element.attributes.id
  } else {
    id = generateId()
  }

  const as = getAsPropStatic(element, CUSTOM_DEFAULT_AS_TAGNAME)
  const props = getProps(element)
  const propsImpl = { ...props, id: ID_PLACEHOLDER }
  const stateImpl = getStateStatic(name, defs)
  const setStateImpl = getSetState(ID_PLACEHOLDER)

  instances[id] = {
    name,
    id,
    type: as,
    state: stateImpl,
    props: { ...props, id },
  }

  let rendered

  if (def.renderCase) {
    rendered = reduceRendered(def.renderCase(stateImpl, setStateImpl, propsImpl)(stateImpl, setStateImpl, propsImpl))
  } else {
    rendered = reduceRendered(def.render(stateImpl, setStateImpl, propsImpl))
  }

  if (def.shouldComponentUpdate) {
    instances[id].renderCache = rendered
  }

  if (def.memo) {
    if (!memoCache[def.name]) {
      memoCache[def.name] = {}
    }

    const propsWithoutId = { ...props }
    delete propsWithoutId["id"]

    const memoProps = !propsWithoutId ? "undefined" : JSON.stringify(propsWithoutId)
    if (!memoCache[def.name][memoProps]) {
      memoCache[def.name][memoProps] = {}
    }
    const memoState = !stateImpl ? "undefined" : JSON.stringify(stateImpl)
    memoCache[def.name][memoProps][memoState] = { rendered }
  }

  // @ts-ignore
  return renderElementWrapper(rendered.toString().replaceAll(ID_PLACEHOLDER, id), as, { id })
}

const renderEofolFlatElement = (element: JSONElement, memoCache: any, defs: Defs) => {
  const { def: defx } = initRender(element, defs)
  const def = defx as (DefFlat & DefSaved) | undefined

  const props = getProps(element)

  if (!def) {
    return undefined
  }

  const rendered = reduceRendered(def.render(props))
  const as = getAsPropStatic(element, FLAT_DEFAULT_AS_TAGNAME)

  if (def.memo) {
    if (!memoCache[def.name]) {
      memoCache[def.name] = {}
    }
    memoCache[def.name][!props ? "undefined" : JSON.stringify(props)] = { rendered }
  }

  return renderElementWrapper(rendered, as)
}

const renderEofolStaticElement = (element: JSONElement, memoCache: any, defs: Defs) => {
  const { def: defx } = initRender(element, defs)
  const def = defx as (DefStatic & DefSaved) | undefined

  if (!def) {
    return undefined
  }

  const rendered = reduceRendered(def.render())
  const as = getAsPropStatic(element, STATIC_DEFAULT_AS_TAGNAME)

  memoCache[def.name] = { rendered }

  return renderElementWrapper(rendered, as)
}

const renderEofolVirtualElement = (element: JSONElement, instances: Instances, memoCache: any, defs: Defs) => {
  const { name, def: defx } = initRender(element, defs)
  const def = defx as (DefVirtual & DefSaved) | undefined

  if (!def) {
    return undefined
  }

  let id
  if (element.attributes.id) {
    id = element.attributes.id
  } else {
    id = generateId()
  }

  const props = getProps(element)
  const stateImpl = getStateStatic(name, defs)

  instances[id] = {
    name,
    id,
    type: "virtual",
    state: stateImpl,
    props: { ...props, id },
  }

  /*
  let rendered = ""
  if (def.render || def.renderCase) {
    const stateImpl = getStateStatic(name, defs)
    const setStateImpl = getSetState(ID_PLACEHOLDER)
    if (def.renderCase) {
      rendered = reduceRendered(def.renderCase(stateImpl, setStateImpl)(stateImpl, setStateImpl))
    } else {
      rendered = reduceRendered(def.render(stateImpl, setStateImpl))
    }
  }

  return rendered
  */

  return ""
}

export default { renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement, renderEofolVirtualElement }
