type VDOMType = "tag" | "custom"

type HTMLTag = any

type Handler = Function

interface VDOM {
  type: VDOMType
  name: string
  children?: VDOM[]
  id?: string
}

interface Instance {
  name: string
  id: string
  as: HTMLTag
  type: string
  state?: Object
}

interface Def {
  type: string
  name: string
  render: Handler
  initialState?: Object
  effect?: Handler | Handler[]
  subscribe?: string | string[]
  cases?: Handler
}

let vdom: VDOM = { type: "tag", name: "initial" }
let instances: Instance[] = []

const customDefs: Def[] = []
const flatDefs: Def[] = []
const staticDefs: Def[] = []

const getVdom = () => vdom
const getInstances = () => instances

const getCustomDefs = () => customDefs
const getFlatDefs = () => flatDefs
const getStaticDefs = () => staticDefs

const setVdom = (nextVdom: VDOM) => {
  vdom = nextVdom
}
const setInstances = (nextInstances: Instance[]) => {
  instances = nextInstances
}

export default { getVdom, getInstances, getCustomDefs, getFlatDefs, getStaticDefs, setVdom, setInstances }
