import { DefInstanced, Defs } from "../types"

// @IMPORT-START
import Util from "../util/util"
const { errorInstanceNotFound, errorDefNotFound } = Util
// @IMPORT("../util/util")
// @IMPORT-END

// @IMPORT-START
import Common from "../eofol/common"
const { findInstance } = Common
// @IMPORT("../eofol/common")
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
  const def = findEofolComponentDef(defs)(name) as DefInstanced | undefined
  if (def) {
    return def.initialState ? { ...def.initialState } : undefined
  } else {
    errorDefNotFound(name)
    return undefined
  }
}

const getSetState = (id: string) =>
  `(nextState) => { var id = "${id}"; var thisInstance = findInstance(id);  if (thisInstance) { thisInstance.state = nextState; rerenderComponent(id); pruneInstances(); } else { errorInstanceNotFound(id); }  }`

export default { getState, getSetState, getStateStatic }
