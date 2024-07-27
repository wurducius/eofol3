import { VDOM, Instances, Def } from "./types"

let vdom: VDOM = { type: "tag", name: "initial" }
let instances: Instances = {}

const customDefs: Def[] = []
const flatDefs: Def[] = []
const staticDefs: Def[] = []

let memoCache: any = {}

const getVdom = () => vdom
const getInstances = () => instances

const getCustomDefs = () => customDefs
const getFlatDefs = () => flatDefs
const getStaticDefs = () => staticDefs

const getMemoCache = () => memoCache

const setVdom = (nextVdom: VDOM) => {
  vdom = nextVdom
}
const setInstances = (nextInstances: Instances) => {
  instances = nextInstances
}
const setMemoCache = (nextMemoCache: any) => {
  memoCache = nextMemoCache
}

const registerAsset = (type: string, val: string) => {}

export default {
  getVdom,
  getInstances,
  getCustomDefs,
  getFlatDefs,
  getStaticDefs,
  setVdom,
  setInstances,
  registerAsset,
  getMemoCache,
  setMemoCache,
}
