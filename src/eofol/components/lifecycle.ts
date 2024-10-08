import { DefInstanced, Props } from "../types"

// @IMPORT-START
import Common from "../eofol/common"
const { findInstancedDef } = Common
// @IMPORT("../eofol/common")
// @IMPORT-END

// @IMPORT-START
import Util from "../util/util"
const { errorInstanceNotFound, errorDefNotFound } = Util
// @IMPORT("../util/util")
// @IMPORT-END

// @IMPORT-START
import Stateful from "./stateful"
const { getState, getSetState } = Stateful
// @IMPORT("./stateful")
// @IMPORT-END

// @IMPORT-START
import Internals from "../eofol/eofol-internals"
const { getInstances } = Internals
// @IMPORT("../eofol/eofol-internals")
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

const playEffect = (effect: any, id: string, props: Props | undefined, body: any) => {
  const stateImpl = getState(id)
  const setStateImpl = getSetState(id)
  const propsImpl = { ...props, id }
  const setBody = (nextBody: any) => {
    getInstances()[id].body = nextBody
  }

  const cleanup = effect(stateImpl, setStateImpl, propsImpl, body, setBody)
  if (cleanup) {
    cleanup(stateImpl, setStateImpl, propsImpl, body, setBody)
  }
}

const componentUpdated = (def: DefInstanced, id: string, props: Props | undefined, body: any) => {
  if (def.effect) {
    if (Array.isArray(def.effect)) {
      def.effect.forEach((effect) => {
        playEffect(effect, id, props, body)
      })
    } else {
      playEffect(def.effect, id, props, body)
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
      componentUpdated(def, instance.id, instance.props, instance.body)
    } else {
      errorDefNotFound(instance.name)
    }
  })
}

export default { componentMounted, componentUnmounted, componentUpdated, replayInitialEffects }
