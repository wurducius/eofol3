import { Def, Props } from "./types"

// @IMPORT-START
import Util from "./util"
const { errorTypeUnknown, errorInstanceNotFound, errorDefNotFound } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import Constants from "./constants"
const { COMPONENT_TYPE_CUSTOM, COMPONENT_TYPE_FLAT, COMPONENT_TYPE_STATIC } = Constants
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
const { getInstances } = Internals
// @IMPORT("./eofol-internals")
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
  const setStateImpl = getSetState(id)
  const propsImpl = { ...props, id }

  let rendered
  if (def.renderCase) {
    rendered = def.renderCase(stateImpl, setStateImpl, propsImpl)(stateImpl, setStateImpl, propsImpl)
  } else {
    rendered = def.render(stateImpl, setStateImpl, propsImpl)
  }

  if (def.shouldComponentUpdate) {
    instance.renderCache = rendered
  }

  if (def.memo) {
    instance.memo = { props: propsImpl, state: stateImpl, rendered }
  }

  if (def.effect) {
    def.effect(stateImpl, setStateImpl, propsImpl)
  }

  return rendered
}

const renderFlatDynamic = (def: Def, props: Props | undefined) => {
  return def.render(props)
}

const renderStaticDynamic = (def: Def) => {
  return def.render()
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
