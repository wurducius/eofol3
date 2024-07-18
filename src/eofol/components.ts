import { Def, Defs, JSONElement, Props } from "./types"

// @IMPORT-START
import EofolInternals from "./eofol-internals"
const { getCustomDefs, getFlatDefs, getStaticDefs } = EofolInternals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Util from "./util"
const { errorTypeUnknown, errorCustomCannotHaveChildren } = Util
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

const defineCustomComponent = (componentDef: Def) => {
  getCustomDefs().push({ ...componentDef, type: COMPONENT_TYPE_CUSTOM })
  return componentDef
}
const defineFlatComponent = (componentDef: Def) => {
  getFlatDefs().push({ ...componentDef, type: COMPONENT_TYPE_FLAT })
  return componentDef
}
const defineStaticComponent = (componentDef: Def) => {
  getStaticDefs().push({ ...componentDef, type: COMPONENT_TYPE_STATIC })
  return componentDef
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
}
