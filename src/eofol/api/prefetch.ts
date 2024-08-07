// @IMPORT-START
import Fetch from "./fetch"
const { get } = Fetch
// @IMPORT("./fetch")
// @IMPORT-END

// @IMPORT-START
import Internals from "../eofol/eofol-internals"
const { getAssets, setAssets } = Internals
// @IMPORT("../eofol/eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Constants from "../constants"
const {
  ASSET_LINK_INTERNAL,
  ASSET_LINK_EXTERNAL,
  ASSET_IMAGE_DYNAMIC,
  ASSET_IMAGE_STATIC,
  ASSET_STATUS_FETCHING,
  ASSET_STATUS_FETCHED,
} = Constants
// @IMPORT("../constants")
// @IMPORT-END

const getInternalPageAssets = (url: string) => {
  const split = url.split(".")
  const page = split.reduce((acc, next, i) => {
    if (i === 0) {
      return next
    } else if (i + 1 === split.length) {
      return acc
    } else {
      return `${acc}.${next}`
    }
  }, "")
  return [url, `assets/js/${page}.js`]
}

const addImpl = (assetsToPrefetch: any, type: string) => (addUrl: string) => {
  assetsToPrefetch.push({
    fetchUrl: addUrl,
    type,
    status: undefined,
  })
}

const addAsset = (assetsToPrefetch: any, assets: any) => (type: string, mapper?: any) => {
  const add = addImpl(assetsToPrefetch, type)
  for (const index in assets[type]) {
    const fetchUrl = mapper ? mapper(assets[type][index].url) : assets[type][index].url
    if (Array.isArray(fetchUrl)) {
      fetchUrl.forEach(add)
    } else {
      add(fetchUrl)
    }
  }
}

const prefetch = () => {
  const assets = getAssets()
  const assetsToPrefetch: { fetchUrl: any; type: any; status: any }[] = []
  const add = addAsset(assetsToPrefetch, assets)

  add(ASSET_LINK_INTERNAL, getInternalPageAssets)
  add(ASSET_LINK_EXTERNAL)
  add(ASSET_IMAGE_DYNAMIC)
  add(ASSET_IMAGE_STATIC)

  Promise.all(
    assetsToPrefetch.map((assetToPrefetch) => {
      assets[assetToPrefetch.type].status = ASSET_STATUS_FETCHING
      setAssets(assets)
      return get(assetToPrefetch.fetchUrl).then(() => {
        assets[assetToPrefetch.type].status = ASSET_STATUS_FETCHED
        setAssets(assets)
        console.log(`Prefetch API: Prefetched asset -> ${assetToPrefetch.fetchUrl}.`)
      })
    }),
  ).then(() => {
    console.log("Prefetch API: Sucessfully prefetched all assets.")
  })
}

export default { prefetch }
