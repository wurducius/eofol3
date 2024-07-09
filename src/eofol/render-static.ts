// @IMPORT-START
import Util from "./util"
const { errorRuntime, generateId } = Util
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

///////////////////////////////////////////////////////////////////////////////
//////////////////////////     CUSTOM       ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const renderEofolCustomElement = (element: any, instances: any, defs: any) => {
  const name = getEofolComponentType(element)
  const def = findEofolComponentDef(defs)(name)
  const props = getProps(element)

  if (!def) {
    errorRuntime(`Cannot render custom eofol element: definition not found for component type: "${name}"`)
  }

  let id
  if (element.attributes.id) {
    id = element.attributes.id
  } else {
    id = generateId()
  }

  const as = element?.attributes?.as ?? "div"
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
          const thisInstance = instances.find((instance: any) => instance.id === id)
          if (thisInstance) {
            thisInstance.state = nextState
            // @TODO import
            // forceRerender();
            console.log("forceRerender()")
          } else {
            // @TODO Extract
            console.log(`EOFOL ERROR - Couldn't find component instance for name: ${name}.`)
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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////     FLAT    ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const renderEofolFlatElement = (element: any, defs: any) => {
  const name = getEofolComponentType(element)
  const def = findEofolComponentDef(defs)(name)
  const props = getProps(element)

  if (!def) {
    errorRuntime(`Cannot render custom eofol element: definition not found for component type: "${name}"`)
  }

  // @TODO
  const as = element?.attributes?.as ?? "h5"

  return {
    type: as,
    content: [def.render(props)],
    attributes: {},
  }
}

///////////////////////////////////////////////////////////////////////////////
//////////////////////////    STATIC    ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const renderEofolStaticElement = (element: any, defs: any) => {
  const name = getEofolComponentType(element)
  const def = findEofolComponentDef(defs)(name)

  if (!def) {
    errorRuntime(`Cannot render custom eofol element: definition not found for component type: "${name}"`)
  }

  // @TODO
  // const as = element?.attributes?.as ?? "h5";

  const rendered = def.render()
  const reduced = Array.isArray(rendered) ? rendered.join("") : rendered

  return {
    // @TODO
    //  type: "static",
    type: "div",
    content: [reduced],
    // attributes: {},
  }
}

const woot = () => {
  console.log("WOOT RECURSIVE IMPORT WORKING !!!")
}

export default { woot, renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement }
