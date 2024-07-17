import { Def, Props } from "./types"

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

// @IMPORT-START
import Stateful from "./stateful"
const { getState, getSetState } = Stateful
// @IMPORT("./stateful")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { findInstance } = Common
// @IMPORT("./common")
// @IMPORT-END

const renderCustomDynamic = (def: Def, id: string, props: Props | undefined) => {
  const stateImpl = getState(id)
  const instance = findInstance(id)
  if (!instance) {
    console.log(`Couldn't find component instance for id: ${id}`)
    return ""
  }
  const setStateImpl = getSetState(id)
  const propsImpl = { ...props, id }

  return def.render(stateImpl, setStateImpl, propsImpl)
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
      errorRuntime(`Invalid Eofol component type: ${type} for component with name: ${def.name}.`)
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

export default { renderEofolElement }
