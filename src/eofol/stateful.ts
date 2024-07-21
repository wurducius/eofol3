import { Defs } from "./types"

// @IMPORT-START
import Util from "./util"
const { errorInstanceNotFound, errorDefNotFound } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { findInstance } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import Components from "./components"
const { findEofolComponentDef } = Components
// @IMPORT("./components")
// @IMPORT-END

const getState = (id: string) => {
  const thisInstance = findInstance(id)
  if (thisInstance) {
    return thisInstance.state
  } else {
    errorInstanceNotFound(id)
    return undefined
  }
}

const getStateStatic = (name: string, defs: Defs) => {
  const def = findEofolComponentDef(defs)(name)
  if (def) {
    return def.initialState ? { ...def.initialState } : undefined
  } else {
    errorDefNotFound(name)
    return undefined
  }
}

const getSetState = (id: string) =>
  `(nextState) => { var thisInstance = findInstance('${id}');  if (thisInstance) { thisInstance.state = nextState } else { errorInstanceNotFound('${id}'); } rerenderComponent('${id}'); }`

export default { getState, getSetState, getStateStatic }
