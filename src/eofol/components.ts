import {
  Def,
  DefCustom,
  DefFlat,
  DefInstanced,
  Defs,
  DefSaved,
  DefStatic,
  DefVirtual,
  JSONElement,
  Props,
} from "./types"

// @IMPORT-START
import EofolInternals from "./eofol-internals"
const { getCustomDefs, getFlatDefs, getStaticDefs, getInstances, getVirtualDefs } = EofolInternals
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
  COMPONENT_TYPE_VIRTUAL,
  COMPONENT_ATTRIBUTE_TYPE,
  CUSTOM_COMPONENT_TAGNAME,
  FLAT_COMPONENT_TAGNAME,
  STATIC_COMPONENT_TAGNAME,
  VIRTUAL_COMPONENT_TAGNAME,
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
const { findInstancedDef, isBrowser } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import Lifecycle from "./lifecycle"
const { componentUnmounted } = Lifecycle
// @IMPORT("./lifecycle")
// @IMPORT-END

const defineCustomComponent = (name: string, componentDef: DefCustom) => {
  const def = { ...componentDef, type: COMPONENT_TYPE_CUSTOM, name }
  getCustomDefs().push(def)
  return def
}
const defineFlatComponent = (name: string, componentDef: DefFlat) => {
  const def = { ...componentDef, type: COMPONENT_TYPE_FLAT, name }
  getFlatDefs().push(def)
  return def
}
const defineStaticComponent = (name: string, componentDef: DefStatic) => {
  const def = { ...componentDef, type: COMPONENT_TYPE_STATIC, name }
  getStaticDefs().push(def)
  return def
}
const defineVirtualComponent = (name: string, componentDef: DefVirtual) => {
  const def = { ...componentDef, type: COMPONENT_TYPE_VIRTUAL, name }
  getVirtualDefs().push(def)
  return def
}

const getEofolComponentType = (element: JSONElement) => element && element.attributes[COMPONENT_ATTRIBUTE_TYPE]

const findEofolComponentDef = (defs: Defs) => (name: string) =>
  // @ts-ignore
  defs.find((componentDef: Def) => componentDef[COMPONENT_ATTRIBUTE_TYPE] === name)

const isEofolCustomElement = (element: JSONElement) => element && element.type === CUSTOM_COMPONENT_TAGNAME

const isEofolFlatElement = (element: JSONElement) => element && element.type === FLAT_COMPONENT_TAGNAME

const isEofolStaticElement = (element: JSONElement) => element && element.type === STATIC_COMPONENT_TAGNAME

const isEofolVirtualElement = (element: JSONElement) => element && element.type === VIRTUAL_COMPONENT_TAGNAME

const validateEofolCustomElement = (element: JSONElement) => {
  if (Array.isArray(element.content) && element.content.length > 0) {
    errorCustomCannotHaveChildren(getEofolComponentType(element))
  }
}

const isConcrete = (def: (DefInstanced & DefSaved) | undefined) =>
  def && ((def.type === "virtual" && isVirtualComponentConcrete(def)) || def.type === "custom")

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

const isVirtualComponentConcrete = (def: DefVirtual) => def.render || def.renderCase

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
  const def = findInstancedDef(name)
  if (!def) {
    return undefined
  }
  if (isConcrete(def)) {
    const target = isBrowser() ? document.getElementById(id) : null
    if (target) {
      target.innerHTML = renderEofolElement(name, props, id, def) ?? ""
    } else {
      errorElementNotFound(id, name)
    }
  } else {
    renderEofolElement(name, props, id, def)
  }
}

const pruneInstances = () => {
  const instances = getInstances()
  const unmounted: string[] = []
  const prune = (id: string) => {
    if (!document.getElementById(id)) {
      unmounted.push(id)
    }
  }
  Object.keys(instances).forEach((id) => {
    const def = findInstancedDef(instances[id].name)
    if (isConcrete(def)) {
      prune(id)
    }
  })
  unmounted.forEach((id) => {
    delete instances[id]
    componentUnmounted(id)
  })
}

const forceRerender = () => {
  const instances = getInstances()
  Object.keys(instances).forEach((id) => {
    rerenderComponent(id)
  })
  pruneInstances()
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
  defineVirtualComponent,
  isEofolVirtualElement,
  isVirtualComponentConcrete,
}
