// @IMPORT-START
import EofolInternals from "./eofol-internals"
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

const defineCustomComponent = (componentDef: any) => {
  getCustomDefs().push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_CUSTOM })
  return componentDef
}
const defineFlatComponent = (componentDef: any) => {
  getFlatDefs().push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_FLAT })
  return componentDef
}
const defineStaticComponent = (componentDef: any) => {
  getStaticDefs().push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_STATIC })
  return componentDef
}

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
}
