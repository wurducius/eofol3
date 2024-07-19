// @IMPORT-START
import EofolInternals from "./eofol-internals"
const { getInstances } = EofolInternals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Util from "./util"
const { errorElementNotFound } = Util
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
  const instances = getInstances()
  Object.keys(instances).forEach((childId) => {
    const { id, name, props } = instances[childId]
    const target = isBrowser() ? document.getElementById(id) : null
    if (target) {
      const def = findDef(name)
      if (!def) {
        return undefined
      }
      const rendered = renderEofolElement(name, props, id, def)
      target.innerHTML = rendered ?? ""
    } else {
      errorElementNotFound(id, name)
    }
  })
}

export default { forceRerender }
