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
import { Def, Instance, Props } from "./types"
const { EOFOL_COMPONENT_TYPE_CUSTOM, EOFOL_COMPONENT_TYPE_FLAT, EOFOL_COMPONENT_TYPE_STATIC } = Components
// @IMPORT("./components")
// @IMPORT-END

const renderCustomDynamic = (def: Def, id: string, props: Props | undefined) => {
  const thisInstance = findInstance(id)
  const state = thisInstance?.state
  return def.render(
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
}

const renderFlatDynamic = (def: Def, props: Props | undefined) => {
  return def.render(props)
}

const renderStaticDynamic = (def: Def) => {
  return def.render()
}

const renderDynamic = (type: string, def: Def, id: string | undefined, props: Props | undefined) => {
  switch (type) {
    case EOFOL_COMPONENT_TYPE_CUSTOM: {
      if (!id) {
        return undefined
      }
      return renderCustomDynamic(def, id, props)
    }
    case EOFOL_COMPONENT_TYPE_FLAT: {
      return renderFlatDynamic(def, props)
    }
    case EOFOL_COMPONENT_TYPE_STATIC: {
      return renderStaticDynamic(def)
    }
    default: {
      errorRuntime(`Invalid Eofol component type: ${type} for component with name: ${name}.`)
      return undefined
    }
  }
}

const renderEofolElement = (name: string, props: Props | undefined, id: string | undefined, def: Def) => {
  if (def) {
    const type = def.type
    if (!type) {
      return undefined
    }
    return renderDynamic(type, def, id, props)
  } else {
    errorRuntime(`Couldn't find def for Eofol element with name = ${name}.`)
    return undefined
  }
}

const forceRerender = () => {
  // @TODO Instead rather rerender VDOM from top level down
  getInstances()?.forEach((child: Instance) => {
    const { id, name, props } = child
    const target = isBrowser() ? document.getElementById(id) : null
    if (target) {
      const def = findDef(name)
      if (!def) {
        return undefined
      }
      target.innerHTML = renderEofolElement(name, props, id, def)
    } else {
      errorRuntime(`Could't select DOM element with id = ${id} and name = ${name}.`)
    }
  })
}

export default { renderEofolElement, forceRerender }
