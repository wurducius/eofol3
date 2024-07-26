// @IMPORT-START
import RenderStatic from "./render-static"
const { renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement } = RenderStatic
// @IMPORT("./render-static")
// @IMPORT-END

// @IMPORT-START
import Components from "./components"
const {
  isEofolCustomElement,
  isEofolFlatElement,
  isEofolStaticElement,
  validateEofolCustomElement,
  getEofolComponentType,
} = Components
// @IMPORT("./components")
// @IMPORT-END

export default {
  getEofolComponentType,
  validateEofolCustomElement,
  isEofolCustomElement,
  isEofolFlatElement,
  isEofolStaticElement,
  renderEofolCustomElement,
  renderEofolFlatElement,
  renderEofolStaticElement,
}
