// @IMPORT-START
import EofolInternals from "./eofol-internals"
import { Def, Defs, JSONElement, Props } from "./types"
const { getCustomDefs, getFlatDefs, getStaticDefs } = EofolInternals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Util from "./util"
const { errorRuntime } = Util
// @IMPORT("./util")
// @IMPORT-END

const EOFOL_COMPONENT_TYPE_CUSTOM = "custom"
const EOFOL_COMPONENT_TYPE_FLAT = "flat"
const EOFOL_COMPONENT_TYPE_STATIC = "static"

const EOFOL_CUSTOM_COMPONENT_TAGNAME = "custom"
const EOFOL_FLAT_COMPONENT_TAGNAME = "flat"
const EOFOL_STATIC_COMPONENT_TAGNAME = "static"

const EOFOL_COMPONENT_ATTRIBUTE_TYPE = "name"

const defineCustomComponent = (componentDef: Def) => {
  getCustomDefs().push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_CUSTOM })
  return componentDef
}
const defineFlatComponent = (componentDef: Def) => {
  getFlatDefs().push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_FLAT })
  return componentDef
}
const defineStaticComponent = (componentDef: Def) => {
  getStaticDefs().push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_STATIC })
  return componentDef
}

const getEofolComponentType = (element: JSONElement) => element && element.attributes[EOFOL_COMPONENT_ATTRIBUTE_TYPE]

const findEofolComponentDef = (defs: Defs) => (name: string) =>
  defs.find((componentDef: Def) => componentDef[EOFOL_COMPONENT_ATTRIBUTE_TYPE] === name)

const isEofolCustomElement = (element: JSONElement) => element && element.type === EOFOL_CUSTOM_COMPONENT_TAGNAME

const isEofolFlatElement = (element: JSONElement) => element && element.type === EOFOL_FLAT_COMPONENT_TAGNAME

const isEofolStaticElement = (element: JSONElement) => element && element.type === EOFOL_STATIC_COMPONENT_TAGNAME

const validateEofolCustomElement = (element: JSONElement) => {
  if (Array.isArray(element.content) && element.content.length > 0) {
    errorRuntime(
      `Eofol validation error: Custom eofol component cannot have children: Component ${getEofolComponentType(
        element,
      )}`,
    )
  }
}

// @TODO typing any
const switchComponentTypeStatic = (handlers: any) => (element: JSONElement) => {
  if (isEofolCustomElement(element)) {
    return handlers[EOFOL_CUSTOM_COMPONENT_TAGNAME](element)
  } else if (isEofolFlatElement(element)) {
    return handlers[EOFOL_FLAT_COMPONENT_TAGNAME](element)
  } else if (isEofolStaticElement(element)) {
    return handlers[EOFOL_STATIC_COMPONENT_TAGNAME](element)
  } else {
    errorRuntime(`Unknown Eofol component type: ${element.type}.`)
    return undefined
  }
}

// @TODO typing any
const switchComponentTypeDynamic = (handlers: any) => (type: string, def: Def, id: string, props: Props) => {
  switch (type) {
    case EOFOL_COMPONENT_TYPE_CUSTOM: {
      if (!id) {
        return undefined
      }
      return handlers[EOFOL_COMPONENT_TYPE_CUSTOM](def, id, props)
    }
    case EOFOL_COMPONENT_TYPE_FLAT: {
      return handlers[EOFOL_COMPONENT_TYPE_FLAT](def, id, props)
    }
    case EOFOL_COMPONENT_TYPE_STATIC: {
      return handlers[EOFOL_COMPONENT_TYPE_STATIC](def, id, props)
    }
    default: {
      errorRuntime(`Invalid Eofol component type: ${type} for component with name: ${def.name}.`)
      return undefined
    }
  }
}

export default {
  getEofolComponentType,
  findEofolComponentDef,
  EOFOL_COMPONENT_TYPE_CUSTOM,
  EOFOL_COMPONENT_TYPE_FLAT,
  EOFOL_COMPONENT_TYPE_STATIC,
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
