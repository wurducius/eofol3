// @IMPORT-START
import RenderStatic from "./components/render-static"
const { renderEofolCustomElement, renderEofolFlatElement, renderEofolStaticElement, renderEofolVirtualElement } =
  RenderStatic
// @IMPORT("./components/render-static")
// @IMPORT-END

// @IMPORT-START
import EofolInternals from "./eofol/eofol-internals"
// eslint-disable-next-line no-unused-vars
const { setVdom, setInstances, setConfig, getConfig, setAssets } = EofolInternals
// @IMPORT("./eofol/eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Common from "./eofol/common"
const { isBrowser, findDef, findInstance } = Common
// @IMPORT("./eofol/common")
// @IMPORT-END

// @IMPORT-START
import CreateElement from "./components/create-element"
const { createElement, e } = CreateElement
// @IMPORT("./components/create-element")
// @IMPORT-END

// @IMPORT-START
import Crypto from "./util/crypto"
const { generateId } = Crypto
// @IMPORT("./util/crypto")
// @IMPORT-END

// @IMPORT-START
import Util from "./util/util"
const { ax, cx } = Util
// @IMPORT("./util/util")
// @IMPORT-END

// @IMPORT-START
import Components from "./components/components"
const { defineCustomComponent, defineFlatComponent, defineStaticComponent, defineVirtualComponent, forceRerender } =
  Components
// @IMPORT("./components/components")
// @IMPORT-END

// @IMPORT-START
import Stateful from "./components/stateful"
const { getState, getSetState } = Stateful
// @IMPORT("./components/stateful")
// @IMPORT-END

// @IMPORT-START
import HandlerSerialize from "./api/handler-serialize"
const { handler, handlerProps, handlerSimple } = HandlerSerialize
// @IMPORT("./api/handler-serialize")
// @IMPORT-END

// @IMPORT-START
import Html from "./ui/html"
const {
  a,
  div,
  span,
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  button,
  img,
  code,
  pre,
  table,
  thead,
  tbody,
  td,
  th,
  tr,
  ul,
  li,
  ol,
  input,
  textarea,
  select,
} = Html
// @IMPORT("./ui/html")
// @IMPORT-END

// @IMPORT-START
import Sx from "./api/sx"
const { sx, getCompileCache, clearCompileCache } = Sx
// @IMPORT("./api/sx")
// @IMPORT-END

// @IMPORT-START
import Link from "./ui/link"
const { internalLink, externalLink } = Link
// @IMPORT("./ui/link")
// @IMPORT-END

// @IMPORT-START
import Init from "./eofol/init"
// eslint-disable-next-line no-unused-vars
const { initEofol } = Init
// @IMPORT("./eofol/init")
// @IMPORT-END

// @IMPORT-START
import Fetch from "./api/fetch"
const { get, post, fetchGeneral } = Fetch
// @IMPORT("./api/fetch")
// @IMPORT-END

// @IMPORT-START
import Image from "./ui/image"
const { imageDynamic, imageStatic } = Image
// @IMPORT("./ui/image")
// @IMPORT-END

// @IMPORT-START
import DataContainer from "./ui/data-container"
const { dataContainer } = DataContainer
// @IMPORT("./ui/data-container")
// @IMPORT-END

// @IMPORT-START
import Form from "./ui/form"
const { defineInputComponent, defineTextareaComponent, defineSelectComponent } = Form
// @IMPORT("./ui/form")
// @IMPORT-END

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
  span,
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  code,
  pre,
  table,
  thead,
  tbody,
  td,
  th,
  tr,
  ul,
  li,
  ol,
  button,
  img,
  input,
  textarea,
  select,
  imageDynamic,
  imageStatic,
  dataContainer,
  getConfig,
  e,
  ax,
  cx,
  defineInputComponent,
  defineTextareaComponent,
  defineSelectComponent,
}
