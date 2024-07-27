import { Def, DefDeclaration, Defs, JSONElement, Props } from "./types"

// @IMPORT-START
import EofolInternals from "./eofol-internals"
const { getCustomDefs, getFlatDefs, getStaticDefs, getInstances, getMemoCache } = EofolInternals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Util from "./util"
const { errorTypeUnknown, errorCustomCannotHaveChildren, errorElementNotFound } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import Contansts from "./constants"
const {
  COMPONENT_TYPE_CUSTOM,
  COMPONENT_TYPE_FLAT,
  COMPONENT_TYPE_STATIC,
  COMPONENT_ATTRIBUTE_TYPE,
  CUSTOM_COMPONENT_TAGNAME,
  FLAT_COMPONENT_TAGNAME,
  STATIC_COMPONENT_TAGNAME,
} = Contansts
// @IMPORT("./constants")
// @IMPORT-END

// @IMPORT-START
import RenderDynamic from "./render-dynamic"
const { renderEofolElement } = RenderDynamic
// @IMPORT("./render-dynamic")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { findDef, isBrowser } = Common
// @IMPORT("./common")
// @IMPORT-END

const defineCustomComponent = (name: string, componentDef: DefDeclaration) => {
  const def = { ...componentDef, type: COMPONENT_TYPE_CUSTOM, name }
  getCustomDefs().push(def)
  return def
}
const defineFlatComponent = (name: string, componentDef: DefDeclaration) => {
  const def = { ...componentDef, type: COMPONENT_TYPE_FLAT, name }
  getFlatDefs().push(def)
  return def
}
const defineStaticComponent = (name: string, componentDef: DefDeclaration) => {
  const def = { ...componentDef, type: COMPONENT_TYPE_STATIC, name }
  getStaticDefs().push(def)
  return def
}

const getEofolComponentType = (element: JSONElement) => element && element.attributes[COMPONENT_ATTRIBUTE_TYPE]

const findEofolComponentDef = (defs: Defs) => (name: string) =>
  // @ts-ignore
  defs.find((componentDef: Def) => componentDef[COMPONENT_ATTRIBUTE_TYPE] === name)

const isEofolCustomElement = (element: JSONElement) => element && element.type === CUSTOM_COMPONENT_TAGNAME

const isEofolFlatElement = (element: JSONElement) => element && element.type === FLAT_COMPONENT_TAGNAME

const isEofolStaticElement = (element: JSONElement) => element && element.type === STATIC_COMPONENT_TAGNAME

const validateEofolCustomElement = (element: JSONElement) => {
  if (Array.isArray(element.content) && element.content.length > 0) {
    errorCustomCannotHaveChildren(getEofolComponentType(element))
  }
}

// @TODO typing any
const switchComponentTypeStatic = (handlers: any) => (element: JSONElement) => {
  if (isEofolCustomElement(element)) {
    return handlers[CUSTOM_COMPONENT_TAGNAME](element)
  } else if (isEofolFlatElement(element)) {
    return handlers[FLAT_COMPONENT_TAGNAME](element)
  } else if (isEofolStaticElement(element)) {
    return handlers[STATIC_COMPONENT_TAGNAME](element)
  } else {
    errorTypeUnknown(element.type)
    return undefined
  }
}

// @TODO typing any
const switchComponentTypeDynamic = (handlers: any) => (type: string, def: Def, id: string, props: Props) => {
  switch (type) {
    case COMPONENT_TYPE_CUSTOM: {
      if (!id) {
        return undefined
      }
      return handlers[COMPONENT_TYPE_CUSTOM](def, id, props)
    }
    case COMPONENT_TYPE_FLAT: {
      return handlers[COMPONENT_TYPE_FLAT](def, id, props)
    }
    case COMPONENT_TYPE_STATIC: {
      return handlers[COMPONENT_TYPE_STATIC](def, id, props)
    }
    default: {
      errorTypeUnknown(type)
      return undefined
    }
  }
}

const deepEqual = (x: any, y: any) => {
  if ((x && !y) || (!x && y)) {
    return false
  } else if (!x && !y) {
    return x === y
  } else {
    return JSON.stringify(x) === JSON.stringify(y)
  }
}

const rerenderComponent = (id: string) => {
  const instances = getInstances()
  const instance = instances[id]
  const { name, props } = instance
  const memoCache = getMemoCache()
  const target = isBrowser() ? document.getElementById(id) : null
  if (target) {
    const def = findDef(name)
    if (!def) {
      return undefined
    }
    if (def.shouldComponentUpdate && def.shouldComponentUpdate(instance.state)) {
      if (instance.renderCache) {
        target.innerHTML = instance.renderCache
      } else {
        console.log(`Render cache not found for id = ${id}`)
      }
    } else {
      if (def.memo) {
        if (deepEqual(props, instance.memo.props) && deepEqual(instance.state, instance.memo.state)) {
          target.innerHTML = instance.memo.rendered ?? ""
        } else if (
          // @TODO remove logic for non-custom components
          memoCache[def.name] &&
          memoCache[def.name][!props ? "undefined" : JSON.stringify(props)] &&
          memoCache[def.name][!props ? "undefined" : JSON.stringify(props)].rendered
        ) {
          target.innerHTML = memoCache[def.name][!props ? "undefined" : JSON.stringify(props)].rendered
        } else {
          target.innerHTML = renderEofolElement(name, props, id, def) ?? ""
        }
      } else {
        if (memoCache[def.name] && memoCache[def.name].rendered && deepEqual(memoCache[def.name].props, props)) {
          target.innerHTML = memoCache[def.name].rendered ?? ""
        } else {
          target.innerHTML = renderEofolElement(name, props, id, def) ?? ""
        }
      }
    }
  } else {
    errorElementNotFound(id, name)
  }
}

const forceRerender = () => {
  const instances = getInstances()
  Object.keys(instances).forEach((id) => {
    rerenderComponent(id)
  })
}

export default {
  getEofolComponentType,
  findEofolComponentDef,
  defineCustomComponent,
  defineFlatComponent,
  defineStaticComponent,
  isEofolCustomElement,
  isEofolFlatElement,
  isEofolStaticElement,
  validateEofolCustomElement,
  switchComponentTypeStatic,
  switchComponentTypeDynamic,
  rerenderComponent,
  forceRerender,
  deepEqual,
}
