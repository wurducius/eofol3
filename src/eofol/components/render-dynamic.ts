import { Def, DefCustom, DefFlat, DefInstanced, DefSaved, DefStatic, DefVirtual, Props, State } from "../types"

// @IMPORT-START
import Util from "../util/util"
const { errorTypeUnknown, errorInstanceNotFound, errorDefNotFound } = Util
// @IMPORT("../util/util")
// @IMPORT-END

// @IMPORT-START
import Constants from "../constants"
const {
  ID_PLACEHOLDER,
  COMPONENT_TYPE_CUSTOM,
  COMPONENT_TYPE_FLAT,
  COMPONENT_TYPE_STATIC,
  COMPONENT_TYPE_VIRTUAL,
  CUSTOM_DEFAULT_AS_TAGNAME,
} = Constants
// @IMPORT("../constants")
// @IMPORT-END

// @IMPORT-START
import Stateful from "./stateful"
const { getState, getSetState } = Stateful
// @IMPORT("./stateful")
// @IMPORT-END

// @IMPORT-START
import Common from "../eofol/common"
const { findInstance } = Common
// @IMPORT("../eofol/common")
// @IMPORT-END

// @IMPORT-START
import Internals from "../eofol/eofol-internals"
const { getInstances, getMemoCache } = Internals
// @IMPORT("../eofol/eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Crypto from "../util/crypto"
const { generateId } = Crypto
// @IMPORT("../util/crypto")
// @IMPORT-END

// @IMPORT-START
import CreateElement from "./create-element"
const { createElement } = CreateElement
// @IMPORT("./create-element")
// @IMPORT-END

// @IMPORT-START
import Lifecycle from "./lifecycle"
const { componentUpdated, componentMounted } = Lifecycle
// @IMPORT("./lifecycle")
// @IMPORT-END

const getAsProp = (props: Props | undefined, defaultTagname: string) => (props && props.as) ?? defaultTagname

const getStateInitial = (def: DefInstanced) => (def.initialState ? { ...def.initialState } : undefined)

const renderSelector = (
  def: DefCustom,
  stateImpl: State | undefined,
  setStateImpl: any,
  propsImpl: Props | undefined,
  bodyImpl: any,
) => {
  if (def.renderCase) {
    return def.renderCase(stateImpl, setStateImpl, propsImpl, bodyImpl)(stateImpl, setStateImpl, propsImpl, bodyImpl)
  } else {
    return def.render(stateImpl, setStateImpl, propsImpl, bodyImpl)
  }
}

const mountComponent = (
  idOriginal: string | undefined,
  def: DefInstanced & DefSaved,
  props: Props | undefined,
  isNotTop?: boolean,
) => {
  let mounted
  let wrapper
  let id

  if (!idOriginal) {
    id = generateId()
  } else {
    id = idOriginal
  }

  const instances = getInstances()

  if (!instances[id]) {
    const as = getAsProp(props, CUSTOM_DEFAULT_AS_TAGNAME)
    const nextState = getStateInitial(def)

    const body = def.constructor ? def.constructor(props) : undefined

    instances[id] = {
      name: def.name,
      id: id,
      type: as,
      state: nextState,
      props: { ...props, id: id },
      body,
    }
    wrapper = true
    mounted = true
  } else {
    mounted = false
    wrapper = false
  }

  if (isNotTop) {
    wrapper = true
  }

  return { id, wrapper, mounted }
}

const renderCustomDynamic = (
  def: DefCustom & DefSaved,
  idOriginal: string | undefined,
  props: Props | undefined,
  isNotTop?: boolean,
) => {
  const { mounted, wrapper, id } = mountComponent(idOriginal, def, props, isNotTop)

  const stateImpl = getState(id)
  const instance = findInstance(id)
  if (!instance) {
    errorInstanceNotFound(id)
    return ""
  }
  const memoCache = getMemoCache()

  const setStateImpl = getSetState(ID_PLACEHOLDER)
  const propsImpl = { ...props, id: ID_PLACEHOLDER }
  const bodyImpl = instance.body

  const render = () => renderSelector(def, stateImpl, setStateImpl, propsImpl, bodyImpl)

  const propsWithoutId = { ...props }
  delete propsWithoutId["id"]

  let rendered

  const saveMemo = (renderedx: any) => {
    if (!memoCache[def.name]) {
      memoCache[def.name] = {}
    }
    const memoProps = !propsWithoutId ? "undefined" : JSON.stringify(propsWithoutId)
    if (!memoCache[def.name][memoProps]) {
      memoCache[def.name][memoProps] = {}
    }
    const memoState = !stateImpl ? "undefined" : JSON.stringify(stateImpl)
    memoCache[def.name][memoProps][memoState] = { rendered: renderedx }
  }

  const renderMemo = () => {
    if (def.memo) {
      if (memoCache[def.name]) {
        const memoProps = !propsWithoutId ? "undefined" : JSON.stringify(propsWithoutId)
        if (memoCache[def.name][memoProps]) {
          const memoState = !stateImpl ? "undefined" : JSON.stringify(stateImpl)
          if (memoCache[def.name][memoProps][memoState] && memoCache[def.name][memoProps][memoState].rendered) {
            rendered = memoCache[def.name][memoProps][memoState].rendered
          } else {
            rendered = render()
            saveMemo(rendered)
          }
        } else {
          rendered = render()
          saveMemo(rendered)
        }
      } else {
        rendered = render()
        saveMemo(rendered)
      }
    } else {
      rendered = render()
    }
  }

  if (def.shouldComponentUpdate) {
    if (!def.shouldComponentUpdate(stateImpl, propsImpl) && instance.renderCache) {
      rendered = instance.renderCache
    } else {
      renderMemo()
      instance.renderCache = rendered
    }
  } else {
    renderMemo()
  }

  componentUpdated(def, id, props, bodyImpl)

  // @ts-ignore
  const content = rendered ? rendered.toString().replaceAll(ID_PLACEHOLDER, id) : ""
  const result: string = (wrapper ? createElement("div", content, def.classname, { id }) : content).toString()

  if (mounted) {
    componentMounted(id)
  }

  return result
}

const renderFlatDynamic = (def: DefFlat & DefSaved, props: Props | undefined) => {
  const render = () => def.render(props)

  if (def.memo) {
    const memoCache = getMemoCache()
    const memo = memoCache[def.name]
    const memoProps = !props ? "undefined" : JSON.stringify(props)
    if (memo && memo[memoProps] && memo[memoProps].rendered) {
      return memo[memoProps].rendered
    } else {
      const rendered = render()
      if (!memoCache[def.name]) {
        memoCache[def.name] = {}
      }
      memoCache[def.name][memoProps] = { rendered }
      return rendered
    }
  } else {
    return render()
  }
}

const renderStaticDynamic = (def: DefStatic & DefSaved) => {
  const memo = getMemoCache()[def.name]
  if (memo && memo.rendered) {
    return memo.rendered
  } else {
    return def.render()
  }
}

const renderVirtualDynamic = (def: DefVirtual & DefSaved, idOriginal: string | undefined, isNotTop?: boolean) => {
  const { mounted, wrapper, id } = mountComponent(idOriginal, def, {}, isNotTop)

  const instance = findInstance(id)
  if (!instance) {
    errorInstanceNotFound(id)
    return ""
  }

  let rendered = ""
  const propsImpl = { id }

  const isRender = def.render || def.renderCase

  let result: string

  if (isRender) {
    rendered = renderSelector(def, getState(id), getSetState(ID_PLACEHOLDER), propsImpl, instance.body)
    // @ts-ignore
    const content = rendered ? rendered.toString().replaceAll(ID_PLACEHOLDER, id) : ""
    result = (wrapper ? createElement("div", content, def.classname, { id }) : content).toString()
  } else {
    result = ""
  }

  if (mounted) {
    componentMounted(id)
  }

  componentUpdated(def, id, propsImpl, instance.body)

  return result
}

const renderDynamic = (
  type: string,
  def: Def,
  id: string | undefined,
  props: Props | undefined,
  isNotTop?: boolean,
) => {
  switch (type) {
    case COMPONENT_TYPE_CUSTOM: {
      return renderCustomDynamic(def, id, props, isNotTop)
    }
    case COMPONENT_TYPE_FLAT: {
      return renderFlatDynamic(def, props)
    }
    case COMPONENT_TYPE_STATIC: {
      return renderStaticDynamic(def)
    }
    case COMPONENT_TYPE_VIRTUAL: {
      return renderVirtualDynamic(def, id, isNotTop)
    }
    default: {
      errorTypeUnknown(type)
      return undefined
    }
  }
}

const renderEofolElement = (
  name: string,
  props: Props | undefined,
  id: string | undefined,
  def: Def & DefSaved,
  isNotTop?: boolean,
) => {
  if (def) {
    const type = def.type
    if (!type) {
      return undefined
    }
    return renderDynamic(type, def, id, props, isNotTop)
  } else {
    errorDefNotFound(name)
    return undefined
  }
}

export default { renderEofolElement }
