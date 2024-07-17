// @IMPORT-START
import RenderStatic from "./render-static"
const { renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement } = RenderStatic
// @IMPORT("./render-static")
// @IMPORT-END

// @IMPORT-START
import EofolInternals from "./eofol-internals"
// eslint-disable-next-line no-unused-vars
const { setVdom, setInstances } = EofolInternals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { isBrowser, findDef, findInstance } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import ForceRerender from "./force-rerender"
const { forceRerender } = ForceRerender
// @IMPORT("./force-rerender")
// @IMPORT-END

// @IMPORT-START
import CreateElement from "./create-element"
const { createElement } = CreateElement
// @IMPORT("./create-element")
// @IMPORT-END

// @IMPORT-START
import Util from "./util"
const { generateId } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import ServiceWorker from "./service-worker"
const { registerServiceworker } = ServiceWorker
// @IMPORT("./service-worker")
// @IMPORT-END

// @IMPORT-START
import Components from "./components"
const {
  defineCustomComponent,
  defineFlatComponent,
  defineStaticComponent,
  isEofolCustomElement,
  isEofolFlatElement,
  isEofolStaticElement,
  validateEofolCustomElement,
  getEofolComponentType,
} = Components
// @IMPORT("./components")
// @IMPORT-END

// @IMPORT-START
import EofolConfigRuntime from "./eofol-config-runtime"
const { SERVICE_WORKER_REGISTER_AT_INIT, SERVICE_WORKER_SCRIPT_FILENAME } = EofolConfigRuntime
// @IMPORT("./eofol-config-runtime")
// @IMPORT-END

// @IMPORT-START
import Stateful from "./stateful"
const { getState, getSetState } = Stateful
// @IMPORT("./stateful)
// @IMPORT-END

const initEofol = () => {
  // const htmlPageRaw = isBrowser() ? window.location.pathname.split("/").pop() : ""
  // const page = (!htmlPageRaw || htmlPageRaw?.length === 0 ? "index" : htmlPageRaw).split(".")[0]
}

initEofol()

if (SERVICE_WORKER_REGISTER_AT_INIT) {
  // @TODO allow relative path from view page
  registerServiceworker(`./${SERVICE_WORKER_SCRIPT_FILENAME}`)
}

export default {
  isBrowser,
  forceRerender,
  createElement,
  generateId,
  renderEofolCustomElement,
  renderEofolFlatElement,
  renderEofolStaticElement,
  defineCustomComponent,
  defineFlatComponent,
  defineStaticComponent,
  getEofolComponentType,
  validateEofolCustomElement,
  isEofolCustomElement,
  isEofolFlatElement,
  isEofolStaticElement,
  getState,
  getSetState,
  findInstance,
  findDef,
}
