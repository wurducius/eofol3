import { Def, Props } from "./types"

// @IMPORT-START
import Util from "./util"
const { errorTypeUnknown, errorInstanceNotFound, errorDefNotFound } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import Constants from "./constants"
const { ID_PLACEHOLDER, COMPONENT_TYPE_CUSTOM, COMPONENT_TYPE_FLAT, COMPONENT_TYPE_STATIC } = Constants
// @IMPORT("./constants")
// @IMPORT-END

// @IMPORT-START
import Stateful from "./stateful"
const { getState, getSetState } = Stateful
// @IMPORT("./stateful")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { findInstance, findDef } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import Internals from "./eofol-internals"
const { getInstances, getMemoCache } = Internals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Components from "./components"
const { deepEqual } = Components
// @IMPORT("./components")
// @IMPORT-END

const componentRenderedCustom = (def: Def, id: string, props: Props | undefined) => {
  const stateImpl = getState(id)
  const setStateImpl = getSetState(id)
  const propsImpl = { ...props, id }

  if (def.effect) {
    def.effect(stateImpl, setStateImpl, propsImpl)
  }
}

const replayInitialEffects = () => {
  const instances = getInstances()
  Object.keys(instances).forEach((id) => {
    const instance = instances[id]
    if (!instance) {
      errorInstanceNotFound(id)
    }
    const def = findDef(instance.name)
    if (def) {
      componentRenderedCustom(def, instance.id, instance.props)
    } else {
      errorDefNotFound(instance.name)
    }
  })
}

const renderCustomDynamic = (def: Def, id: string, props: Props | undefined) => {
  const stateImpl = getState(id)
  const instance = findInstance(id)
  if (!instance) {
    errorInstanceNotFound(id)
    return ""
  }
  const memoCache = getMemoCache()

  const setStateImpl = getSetState(ID_PLACEHOLDER)
  const propsImpl = { ...props, id: ID_PLACEHOLDER }

  const render = () => {
    if (def.renderCase) {
      return def.renderCase(stateImpl, setStateImpl, propsImpl)(stateImpl, setStateImpl, propsImpl)
    } else {
      return def.render(stateImpl, setStateImpl, propsImpl)
    }
  }

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

  if (def.effect) {
    // @ts-ignore
    def.effect(stateImpl, setStateImpl.replaceAll(ID_PLACEHOLDER, id), propsImpl)
  }

  // @ts-ignore
  return rendered ? rendered.toString().replaceAll(ID_PLACEHOLDER, id) : ""
}

const renderFlatDynamic = (def: Def, props: Props | undefined) => {
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

const renderStaticDynamic = (def: Def) => {
  const memo = getMemoCache()[def.name]
  if (memo && memo.rendered) {
    return memo.rendered
  } else {
    return def.render()
  }
}

const renderDynamic = (type: string, def: Def, id: string | undefined, props: Props | undefined) => {
  switch (type) {
    case COMPONENT_TYPE_CUSTOM: {
      if (!id) {
        return undefined
      }
      return renderCustomDynamic(def, id, props)
    }
    case COMPONENT_TYPE_FLAT: {
      return renderFlatDynamic(def, props)
    }
    case COMPONENT_TYPE_STATIC: {
      return renderStaticDynamic(def)
    }
    default: {
      errorTypeUnknown(type)
      return undefined
    }
  }
}

const renderEofolElement = (name: string, props: Props | undefined, id: string | undefined, def: Def) => {
  if (def) {
    const type = def.type
    if (!type) {
      return undefined
    }
    return renderDynamic(type, def, id, props)
  } else {
    errorDefNotFound(name)
    return undefined
  }
}

export default { renderEofolElement, replayInitialEffects }
