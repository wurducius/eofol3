import { Defs, Instances, JSONElement } from "./types"

// @IMPORT-START
import Util from "./util"
const { errorDefNotFound, generateId } = Util
// @IMPORT("./util")
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

const RENDER_DEFAULT_AS_TAGNAME = "div"

const initRender = (element: JSONElement, defs: Defs) => {
  const name = getEofolComponentType(element)
  const def = findEofolComponentDef(defs)(name)

  if (!def) {
    errorDefNotFound(name)
  }

  return { name, def }
}

const getAsProp = (element: JSONElement, defaultTagname: string) => element?.attributes?.as ?? defaultTagname

const renderEofolCustomElement = (element: JSONElement, instances: Instances, defs: Defs) => {
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

  const as = getAsProp(element, RENDER_DEFAULT_AS_TAGNAME)
  const props = { ...getProps(element), id }
  const stateImpl = getStateStatic(name, defs)
  const setStateImpl = getSetState(id)

  instances.push({
    name,
    id,
    state: stateImpl,
    setState: setStateImpl,
    props,
    as,
  })

  return {
    type: as,
    content: [def.render(stateImpl, setStateImpl, props)],
    attributes: {
      id,
    },
  }
}

const renderEofolFlatElement = (element: JSONElement, defs: Defs) => {
  const { def } = initRender(element, defs)
  const props = getProps(element)

  if (!def) {
    return undefined
  }

  // @TODO
  const as = getAsProp(element, RENDER_DEFAULT_AS_TAGNAME)

  return {
    type: as,
    content: [def.render(props)],
    attributes: {},
  }
}

const renderEofolStaticElement = (element: JSONElement, defs: Defs) => {
  const { def } = initRender(element, defs)

  if (!def) {
    return undefined
  }

  const rendered = def.render()
  const reduced = Array.isArray(rendered) ? rendered.join("") : rendered

  const as = getAsProp(element, RENDER_DEFAULT_AS_TAGNAME)

  return {
    type: as,
    content: [reduced],
  }
}

export default { renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement }
