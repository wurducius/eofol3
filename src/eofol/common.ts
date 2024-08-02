import { Def, DefInstanced, Defs, DefSaved, JSONElement } from "./types"

// @IMPORT-START
import EofolInternals from "./eofol-internals"
const { getCustomDefs, getFlatDefs, getStaticDefs, getVirtualDefs, getInstances } = EofolInternals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Contansts from "./constants"
const { PROPS_EXCLUDED } = Contansts
// @IMPORT("./constants")
// @IMPORT-END
//

const isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined"

const findGeneralDef = (generalDefs: Defs) => (tagname: string) => generalDefs.find((def: Def) => def.name === tagname)
const findCustomDef = findGeneralDef(getCustomDefs())
const findFlatDef = findGeneralDef(getFlatDefs())
const findStaticDef = findGeneralDef(getStaticDefs())
const findVirtualDef = findGeneralDef(getVirtualDefs())

const findDef = (tagname: string) =>
  findCustomDef(tagname) || findFlatDef(tagname) || findStaticDef(tagname) || findVirtualDef(tagname)
const findInstancedDef = (tagname: string): (DefInstanced & DefSaved) | undefined =>
  findCustomDef(tagname) || findVirtualDef(tagname)

const findInstance = (id: string) => getInstances()[id]

const getProps = (element: JSONElement) => {
  const props = structuredClone(element.attributes)
  Object.keys(props)
    .filter((key) => PROPS_EXCLUDED.reduce((acc, next) => acc || key === next, false))
    .forEach((key) => delete props[key])
  return props
}

export default { isBrowser, findDef, findInstance, findInstancedDef, getProps }
