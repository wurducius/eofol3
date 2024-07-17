// @IMPORT-START
import Util from "./util"
const { errorRuntime } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import ForceRerender from "./force-rerender"
const { forceRerender } = ForceRerender
// @IMPORT("./force-rerender")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { findInstance, isBrowser } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import Components from "./components"
const { findEofolComponentDef } = Components
// @IMPORT("./components")
// @IMPORT-END

const getState = (id: string, name: string, defs?: any) => () => {
  if (isBrowser()) {
    const thisInstance = findInstance(id)
    if (thisInstance) {
      return thisInstance.state
    } else {
      errorRuntime(`Couldn't find component instance for id: ${id}.`)
      return undefined
    }
  } else {
    const def = findEofolComponentDef(defs)(name)
    if (def) {
      return def.initialState ? { ...def.initialState } : undefined
    } else {
      errorRuntime(`GETSTATE: Couldn't find def for name: ${name}.`)
      return undefined
    }
  }
}

const getSetState = (id: string) => () => (nextState: any) => {
  console.log("setState fired!")
  const thisInstance = findInstance(id)
  if (thisInstance) {
    thisInstance.state = nextState
  } else {
    errorRuntime(`Couldn't find component instance for id: ${id}.`)
  }
  forceRerender()
}

const getSetStateDynamic = (id: string) => () =>
  `(nextState) => { var thisInstance = findInstance('${id}');  if (thisInstance) { thisInstance.state = nextState } else { errorRuntime(\`Couldn't find component instance for id: ${id}\`); } forceRerender(); }`

export default { getState, getSetState, getSetStateDynamic }
