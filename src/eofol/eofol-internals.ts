import { VDOM, Instances, DefVirtual, DefStatic, DefFlat, DefCustom, DefSaved } from "./types"

let vdom: VDOM = { type: "tag", name: "initial" }
let instances: Instances = {}
let config: Object = {}

const customDefs: (DefCustom & DefSaved)[] = []
const flatDefs: (DefFlat & DefSaved)[] = []
const staticDefs: (DefStatic & DefSaved)[] = []
const virtualDefs: (DefVirtual & DefSaved)[] = []

let memoCache: any = {}

const getVdom = () => vdom
const getInstances = () => instances
const getConfig = () => config

const getCustomDefs = (): (DefCustom & DefSaved)[] => customDefs
const getFlatDefs = (): (DefFlat & DefSaved)[] => flatDefs
const getStaticDefs = (): (DefStatic & DefSaved)[] => staticDefs
const getVirtualDefs = (): (DefVirtual & DefSaved)[] => virtualDefs

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
