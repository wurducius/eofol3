import {
  VDOM,
  Instances,
  DefVirtual,
  DefStatic,
  DefFlat,
  DefCustom,
  DefSaved,
  MemoCache,
  Config,
  Assets,
  Asset,
} from "../types"

// @IMPORT-START
import Constants from "../constants"
const { ASSET_LINK_INTERNAL, ASSET_LINK_EXTERNAL, ASSET_IMAGE_DYNAMIC, ASSET_IMAGE_STATIC } = Constants
// @IMPORT("../constants")
// @IMPORT-END

let vdom: VDOM = { type: "tag", name: "initial" }
let instances: Instances = {}
let config: Config = { BASE_URL: "/" }

const customDefs: (DefCustom & DefSaved)[] = []
const flatDefs: (DefFlat & DefSaved)[] = []
const staticDefs: (DefStatic & DefSaved)[] = []
const virtualDefs: (DefVirtual & DefSaved)[] = []

let memoCache: MemoCache = {}

let assets: Assets = {
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
const setConfig = (nextConfig: Config) => {
  config = nextConfig
}
const setMemoCache = (nextMemoCache: MemoCache) => {
  memoCache = nextMemoCache
}
const setAssets = (nextAssets: Assets) => {
  assets = nextAssets
}

const registerAsset = (type: string, val: string) => {
  if (!assets[type].find((asset: Asset) => asset.url === val) && !val.startsWith("javascript:") && val !== "/") {
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
