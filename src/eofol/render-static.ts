// @IMPORT-START
import Util from "./util"
const { errorRuntime, generateId } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { getProps, findInstance } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import Components from "./components"
const { getEofolComponentType, findEofolComponentDef } = Components
// @IMPORT("./components")
// @IMPORT-END

const EOFOL_RENDER_DEFAULT_AS_TAGNAME = "div"

const initRender = (element: any, defs: any) => {
  const name = getEofolComponentType(element)
  const def = findEofolComponentDef(defs)(name)

  if (!def) {
    errorRuntime(`Cannot render custom eofol element: definition not found for component type: "${name}"`)
  }

  return { name, def }
}

const getAsProp = (element: any, defaultTagname: string) => element?.attributes?.as ?? defaultTagname

const renderEofolCustomElement = (element: any, instances: any, defs: any) => {
  const { name, def } = initRender(element, defs)
  const props = getProps(element)

  let id
  if (element.attributes.id) {
    id = element.attributes.id
  } else {
    id = generateId()
  }

  const as = getAsProp(element, EOFOL_RENDER_DEFAULT_AS_TAGNAME)

  const stateImpl = def.initialState ? { ...def.initialState } : undefined

  instances.push({
    name,
    id,
    state: stateImpl,
    props,
    as,
  })

  return {
    type: as,
    content: [
      def.render(
        stateImpl,
        (nextState: any) => {
          console.log("Statically compiled setState fired!")
          // @TODO Statically compiled setState
          const thisInstance = findInstance(id)
          if (thisInstance) {
            thisInstance.state = nextState
            // @TODO import
            // forceRerender();
            console.log("forceRerender()")
          } else {
            // @TODO Extract
            errorRuntime(`Couldn't find component instance for name: ${name}.`)
          }
        },
        props,
      ),
    ],
    attributes: {
      id,
    },
  }
}

const renderEofolFlatElement = (element: any, defs: any) => {
  const { def } = initRender(element, defs)
  const props = getProps(element)

  // @TODO
  const as = getAsProp(element, EOFOL_RENDER_DEFAULT_AS_TAGNAME)

  return {
    type: as,
    content: [def.render(props)],
    attributes: {},
  }
}

const renderEofolStaticElement = (element: any, defs: any) => {
  const { def } = initRender(element, defs)

  const rendered = def.render()
  const reduced = Array.isArray(rendered) ? rendered.join("") : rendered

  const as = getAsProp(element, EOFOL_RENDER_DEFAULT_AS_TAGNAME)

  return {
    type: as,
    content: [reduced],
  }
}

export default { renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement }
