import { Instance } from "./types"

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
import RenderDynamic from "./render-dynamic"
const { renderEofolElement } = RenderDynamic
// @IMPORT("./render-dynamic")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { findDef, isBrowser } = Common
// @IMPORT("./common")
// @IMPORT-END

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

export default { forceRerender }
