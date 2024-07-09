// @IMPORT-START
import EofolInternals from "./eofol-internals"
const { getCustomDefs, getFlatDefs, getStaticDefs, getInstances } = EofolInternals
// @IMPORT("./eofol-internals")
// @IMPORT-END

const isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined"

const findGeneralDef = (generalDefs: any) => (tagname: string) => generalDefs.find((def: any) => def.name === tagname)
const findCustomDef = findGeneralDef(getCustomDefs())
const findFlatDef = findGeneralDef(getFlatDefs())
const findStaticDef = findGeneralDef(getStaticDefs())

const findDef = (tagname: string) => findCustomDef(tagname) || findFlatDef(tagname) || findStaticDef(tagname)

const findInstance = (id: string) => getInstances().find((instance) => instance.id === id)

const notProps = ["name", "as"]

const getProps = (element: any) => {
  const props = structuredClone(element.attributes)
  Object.keys(props)
    .filter((key) => notProps.reduce((acc, next) => acc || key === next, false))
    .forEach((key) => delete props[key])
  return props
}

export default { isBrowser, findDef, findInstance, getProps }