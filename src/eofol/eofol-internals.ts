import { VDOM, Instances, Def } from "./types"

let vdom: VDOM = { type: "tag", name: "initial" }
let instances: Instances = {}
let config: Object = {}

const customDefs: Def[] = []
const flatDefs: Def[] = []
const staticDefs: Def[] = []
const virtualDefs: Def[] = []

let memoCache: any = {}

const getVdom = () => vdom
const getInstances = () => instances
const getConfig = () => config

const getCustomDefs = () => customDefs
const getFlatDefs = () => flatDefs
const getStaticDefs = () => staticDefs
const getVirtualDefs = () => virtualDefs

const getMemoCache = () => memoCache

const setVdom = (nextVdom: VDOM) => {
  vdom = nextVdom
}
const setInstances = (nextInstances: Instances) => {
  instances = nextInstances
}
const setConfig = (nextConfig: Object) => {
  config = nextConfig
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
  getVirtualDefs,
  getConfig,
  setConfig,
}
