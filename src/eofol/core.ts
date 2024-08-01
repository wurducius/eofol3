// @IMPORT-START
import RenderStatic from "./render-static"
const { renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement, renderEofolVirtualElement } =
  RenderStatic
// @IMPORT("./render-static")
// @IMPORT-END

// @IMPORT-START
import EofolInternals from "./eofol-internals"
const { setVdom, setInstances, setConfig, getConfig } = EofolInternals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { isBrowser, findDef, findInstance } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import CreateElement from "./create-element"
const { createElement } = CreateElement
// @IMPORT("./create-element")
// @IMPORT-END

// @IMPORT-START
import Crypto from "./crypto"
const { generateId } = Crypto
// @IMPORT("./crypto")
// @IMPORT-END

// @IMPORT-START
import Components from "./components"
const { defineCustomComponent, defineFlatComponent, defineStaticComponent, defineVirtualComponent, forceRerender } =
  Components
// @IMPORT("./components")
// @IMPORT-END

// @IMPORT-START
import Stateful from "./stateful"
const { getState, getSetState } = Stateful
// @IMPORT("./stateful")
// @IMPORT-END

// @IMPORT-START
import HandlerSerialize from "./handler-serialize"
const { handler, handlerProps, handlerSimple } = HandlerSerialize
// @IMPORT("./handler-serialize")
// @IMPORT-END

// @IMPORT-START
import Html from "./html"
const { a, div, p, h1, h2, h3, h4, h5, h6, button, img } = Html
// @IMPORT("./html")
// @IMPORT-END

// @IMPORT-START
import Sx from "./sx"
const { sx, getCompileCache, clearCompileCache } = Sx
// @IMPORT("./sx")
// @IMPORT-END

// @IMPORT-START
import Link from "./link"
const { internalLink, externalLink } = Link
// @IMPORT("./link")
// @IMPORT-END

// @IMPORT-START
import Init from "./init"
const { initEofol } = Init
// @IMPORT("./init")
// @IMPORT-END

// @IMPORT-START
import Fetch from "./fetch"
const { get, post, fetchGeneral } = Fetch
// @IMPORT("./fetch")
// @IMPORT-END

// @IMPORT-START
import Image from "./image"
const { imageDynamic, imageStatic } = Image
// @IMPORT("./image")
// @IMPORT-END

// @IMPORT-START
import DataContainer from "./data-container"
const { dataContainer } = DataContainer
// @IMPORT("./data-container")
// @IMPORT-END

initEofol()

export default {
  isBrowser,
  forceRerender,
  createElement,
  generateId,
  renderEofolCustomElement,
  renderEofolFlatElement,
  renderEofolStaticElement,
  renderEofolVirtualElement,
  defineCustomComponent,
  defineFlatComponent,
  defineStaticComponent,
  defineVirtualComponent,
  getState,
  getSetState,
  findInstance,
  findDef,
  handler,
  handlerProps,
  handlerSimple,
  externalLink,
  internalLink,
  sx,
  getCompileCache,
  clearCompileCache,
  get,
  post,
  fetchGeneral,
  a,
  div,
  button,
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  img,
  imageDynamic,
  imageStatic,
  dataContainer,
  getConfig,
}
