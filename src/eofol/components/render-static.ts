import { DefCustom, DefFlat, Defs, DefSaved, DefStatic, DefVirtual, Instances, JSONElement } from "../types"

// @IMPORT-START
import Util from "../util/util"
const { errorDefNotFound, ax } = Util
// @IMPORT("../util/util")
// @IMPORT-END

// @IMPORT-START
import Crypto from "../util/crypto"
const { generateId } = Crypto
// @IMPORT("../util/crypto")
// @IMPORT-END

// @IMPORT-START
import Common from "../eofol/common"
const { getProps } = Common
// @IMPORT("../eofol/common")
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
import Constants from "../constants"
const { ID_PLACEHOLDER, CUSTOM_DEFAULT_AS_TAGNAME, FLAT_DEFAULT_AS_TAGNAME, STATIC_DEFAULT_AS_TAGNAME } = Constants
// @IMPORT("../constants")
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

const renderElementWrapper = (rendered: JSONElement | string, as: string, attributes?: any) => ({
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
  const body = def.constructor ? def.constructor(propsImpl) : undefined

  instances[id] = {
    name,
    id,
    type: as,
    state: stateImpl,
    props: { ...props, id },
    body,
  }

  let rendered

  if (def.renderCase) {
    rendered = reduceRendered(
      def.renderCase(stateImpl, setStateImpl, propsImpl, body)(stateImpl, setStateImpl, propsImpl, body),
    )
  } else {
    rendered = reduceRendered(def.render(stateImpl, setStateImpl, propsImpl, body))
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
  return renderElementWrapper(
    // @ts-ignore
    rendered.toString().replaceAll(ID_PLACEHOLDER, id),
    as,
    ax({ id }, { class: def.classname }),
  )
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

  return renderElementWrapper(rendered, as, ax({}, { class: def.classname }))
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

  return renderElementWrapper(rendered, as, ax({}, { class: def.classname }))
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
  const propsImpl = { ...props, id }
  const stateImpl = getStateStatic(name, defs)
  const body = def.constructor ? def.constructor(propsImpl) : undefined

  instances[id] = {
    name,
    id,
    type: "div",
    state: stateImpl,
    props: propsImpl,
    body,
  }

  return ""
}

export default { renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement, renderEofolVirtualElement }
