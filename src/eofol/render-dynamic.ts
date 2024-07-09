// @IMPORT-START
import Common from "./common"
const { findDef, findInstance, isBrowser } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import EofolInternals from "./eofol-internals"
const { getInstances } = EofolInternals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Util from "./util"
const { errorRuntime } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import Components from "./components"
const { EOFOL_COMPONENT_TYPE_CUSTOM, EOFOL_COMPONENT_TYPE_FLAT, EOFOL_COMPONENT_TYPE_STATIC } = Components
// @IMPORT("./components")
// @IMPORT-END

const renderEofolElement = (name: string, props: any, id: string, def: any) => {
  if (def) {
    const type = def.type
    let result
    switch (type) {
      case EOFOL_COMPONENT_TYPE_CUSTOM: {
        const thisInstance = findInstance(id)
        const state = thisInstance?.state
        result = def.render(
          state,
          (nextState: any) => {
            console.log("Dynamically compiled setState fired!")
            // @TODO Dynamically compiled setState
            if (thisInstance) {
              thisInstance.state = nextState
              forceRerender()
            } else {
              errorRuntime(`Couldn't find component instance for name: ${name}.`)
            }
          },
          props,
        )
        break
      }
      case EOFOL_COMPONENT_TYPE_FLAT: {
        result = def.render(props)
        break
      }
      case EOFOL_COMPONENT_TYPE_STATIC: {
        result = def.render()
        break
      }
      default: {
        errorRuntime(`Invalid Eofol component type: ${type} for component with name: ${name}.`)
        result = undefined
      }
    }
    return result
  } else {
    errorRuntime(`Couldn't find def for Eofol element with name = ${name}.`)
    return undefined
  }
}

const forceRerender = () => {
  // @TODO Instead rather rerender VDOM from top level down
  getInstances()?.forEach((child: any) => {
    const { id, name, props } = child
    const target = isBrowser() ? document.getElementById(id) : null
    if (target) {
      const def = findDef(name)
      target.innerHTML = renderEofolElement(name, props, id, def)
    }
  })
}

export default { renderEofolElement, forceRerender }
