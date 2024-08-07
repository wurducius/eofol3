import { VDOM, Instances, DefVirtual, DefStatic, DefFlat, DefCustom, DefSaved } from "../types"

// @IMPORT-START
import Constants from "../constants"
const { ASSET_LINK_INTERNAL, ASSET_LINK_EXTERNAL, ASSET_IMAGE_DYNAMIC, ASSET_IMAGE_STATIC } = Constants
// @IMPORT("../constants")
// @IMPORT-END

let vdom: VDOM = { type: "tag", name: "initial" }
let instances: Instances = {}
let config: Object = {}

const customDefs: (DefCustom & DefSaved)[] = []
const flatDefs: (DefFlat & DefSaved)[] = []
const staticDefs: (DefStatic & DefSaved)[] = []
const virtualDefs: (DefVirtual & DefSaved)[] = []

let memoCache: any = {}

let assets: any = {
  [ASSET_LINK_INTERNAL]: [],
  [ASSET_LINK_EXTERNAL]: [],
  [ASSET_IMAGE_STATIC]: [],
  [ASSET_IMAGE_DYNAMIC]: [],
}

const getVdom = () => vdom
const getInstances = () => instances
const getConfig = () => config

const getCustomDefs = (): (DefCustom & DefSaved)[] => customDefs
const getFlatDefs = (): (DefFlat & DefSaved)[] => flatDefs
const getStaticDefs = (): (DefStatic & DefSaved)[] => staticDefs
const getVirtualDefs = (): (DefVirtual & DefSaved)[] => virtualDefs

const getMemoCache = () => memoCache
const getAssets = () => assets

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
const setAssets = (nextAssets: any) => {
  assets = nextAssets
}

const registerAsset = (type: string, val: string) => {
  if (!assets[type].find((asset: any) => asset.url === val) && !val.startsWith("javascript:") && val !== "/") {
    assets[type].push({ url: val, status: undefined })
  }
}

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
  getAssets,
  setAssets,
}
