import { DefInstanced, Props } from "./types"

// @IMPORT-START
import Common from "./common"
const { findInstancedDef } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import Util from "./util"
const { errorInstanceNotFound, errorDefNotFound } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import Stateful from "./stateful"
const { getState, getSetState } = Stateful
// @IMPORT("./stateful")
// @IMPORT-END

// @IMPORT-START
import Internals from "./eofol-internals"
const { getInstances } = Internals
// @IMPORT("./eofol-internals")
// @IMPORT-END

const componentMounted = (id: string) => {
  const def = findInstancedDef(id)

  if (def && def.componentMounted) {
    def.componentMounted()
  }
}

const componentUnmounted = (id: string) => {
  const def = findInstancedDef(id)

  if (def && def.componentUnmounted) {
    def.componentUnmounted()
  }
}

const playEffect = (effect: any, id: string, props: Props | undefined) => {
  const stateImpl = getState(id)
  const setStateImpl = getSetState(id)
  const propsImpl = { ...props, id }

  const cleanup = effect(stateImpl, setStateImpl, propsImpl)
  if (cleanup) {
    cleanup(stateImpl, setStateImpl, propsImpl)
  }
}

const componentUpdated = (def: DefInstanced, id: string, props: Props | undefined) => {
  if (def.effect) {
    if (Array.isArray(def.effect)) {
      def.effect.forEach((effect) => {
        playEffect(effect, id, props)
      })
    } else {
      playEffect(def.effect, id, props)
    }
  }
}

const replayInitialEffects = () => {
  const instances = getInstances()
  Object.keys(instances).forEach((id) => {
    const instance = instances[id]
    if (!instance) {
      errorInstanceNotFound(id)
    }
    const def = findInstancedDef(instance.name)
    if (def) {
      componentUpdated(def, instance.id, instance.props)
    } else {
      errorDefNotFound(instance.name)
    }
  })
}

export default { componentMounted, componentUnmounted, componentUpdated, replayInitialEffects }
