// @IMPORT-START
import RenderStatic from "./components/render-static"
const { renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement, renderEofolVirtualElement } =
  RenderStatic
// @IMPORT("./components/render-static")
// @IMPORT-END

// @IMPORT-START
import Components from "./components/components"
const {
  isEofolCustomElement,
  isEofolFlatElement,
  isEofolStaticElement,
  isEofolVirtualElement,
  validateEofolCustomElement,
  getEofolComponentType,
} = Components
// @IMPORT("./components/components")
// @IMPORT-END

export default {
  getEofolComponentType,
  validateEofolCustomElement,
  isEofolCustomElement,
  isEofolFlatElement,
  isEofolStaticElement,
  isEofolVirtualElement,
  renderEofolCustomElement,
  renderEofolFlatElement,
  renderEofolStaticElement,
  renderEofolVirtualElement,
}
