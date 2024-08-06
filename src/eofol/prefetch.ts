// @IMPORT-START
import Fetch from "./fetch"
const { get } = Fetch
// @IMPORT("./fetch")
// @IMPORT-END

// @IMPORT-START
import Internals from "./eofol-internals"
const { getAssets, setAssets } = Internals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Constants from "./constants"
const {
  ASSET_LINK_INTERNAL,
  ASSET_LINK_EXTERNAL,
  ASSET_IMAGE_DYNAMIC,
  ASSET_IMAGE_STATIC,
  ASSET_STATUS_FETCHING,
  ASSET_STATUS_FETCHED,
} = Constants
// @IMPORT("./constants")
// @IMPORT-END

const getInternalPageAssets = (url: string) => {
  const split = url.split(".")
  const page = split.reduce((acc, next, i) => {
    if (i === 0) {
      return next
    } else if (i + 1 === split.length) {
      return acc
    } else {
      return acc + "." + next
    }
  }, "")
  return [url, `assets/js/${page}.js`]
}

// @TODO add image prefetching
const prefetch = () => {
  const assets = getAssets()
  const assetsToPrefetch = []
  for (const internalPageIndex in assets[ASSET_LINK_INTERNAL]) {
    const nextInternalPage = getInternalPageAssets(assets[ASSET_LINK_INTERNAL][internalPageIndex].url)
    assetsToPrefetch.push({ fetchUrl: nextInternalPage[0], type: ASSET_LINK_INTERNAL, status: undefined })
    assetsToPrefetch.push({ fetchUrl: nextInternalPage[1], type: ASSET_LINK_INTERNAL, status: undefined })
  }
  for (const externalPageIndex in assets[ASSET_LINK_EXTERNAL]) {
    assetsToPrefetch.push({
      fetchUrl: assets[ASSET_LINK_EXTERNAL][externalPageIndex].url,
      type: ASSET_LINK_EXTERNAL,
      status: undefined,
    })
  }
  for (const dynamicImageIndex in assets[ASSET_IMAGE_DYNAMIC]) {
    assetsToPrefetch.push({
      fetchUrl: assets[ASSET_IMAGE_DYNAMIC][dynamicImageIndex].url,
      type: ASSET_IMAGE_DYNAMIC,
      status: undefined,
    })
  }
  for (const staticImageIndex in assets[ASSET_IMAGE_STATIC]) {
    assetsToPrefetch.push({
      fetchUrl: assets[ASSET_IMAGE_STATIC][staticImageIndex].url,
      type: ASSET_IMAGE_STATIC,
      status: undefined,
    })
  }

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
