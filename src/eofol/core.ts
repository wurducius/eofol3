// @IMPORT-START
import RenderStatic from "./render-static"
const { woot, renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement } = RenderStatic
// @IMPORT("./render-static")
// @IMPORT-END

// @IMPORT-START
import RenderDynamic from "./render-dynamic"
const { forceRerender } = RenderDynamic
// @IMPORT("./render-dynamic")
// @IMPORT-END

// @IMPORT-START
import EofolInternals from "./eofol-internals"
const { setVdom, setInstances } = EofolInternals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { isBrowser } = Common
// @IMPORT("./common")
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

woot()

const initEofol = () => {
  const htmlPageRaw = isBrowser() ? window.location.pathname.split("/").pop() : ""
  const page = (!htmlPageRaw || htmlPageRaw?.length === 0 ? "index" : htmlPageRaw).split(".")[0]

  return (
    isBrowser() &&
    fetch(`./eofol/${page}-eofol-internals.json`)
      .then((res) => res.json())
      .then((res) => {
        setVdom(res.vdom)
        setInstances(res.instances)
      })
  )
}

initEofol()

const registerServiceworker = () => {
  if (isBrowser() && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js")
  }
}

registerServiceworker()

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
}
