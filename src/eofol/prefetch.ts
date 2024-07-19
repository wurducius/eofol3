// @IMPORT-START
import Fetch from "./fetch"
const { get } = Fetch
// @IMPORT("./fetch")
// @IMPORT-END

const assetsPagesInternal = ["indexx"]

// const assetsPagesExternal = ["https://youtube.com"]
const assetsPagesExternal: string[] = []

const getInternalPageAssets = (internalUrl: string) => [
  `${internalUrl}.html`,
  `assets/js/${internalUrl}.js`,
  `assets/css/${internalUrl}.css`,
]

const prefetchInit = () => {
  const assetsToPrefetch = []
  for (let internalPageIndex in assetsPagesInternal) {
    const nextInternalPage = getInternalPageAssets(assetsPagesInternal[internalPageIndex])
    for (let internalPageInnerIndex in nextInternalPage) {
      assetsToPrefetch.push(nextInternalPage[internalPageInnerIndex])
    }
  }
  for (let externalPageIndex in assetsPagesExternal) {
    assetsToPrefetch.push(assetsPagesExternal[externalPageIndex])
  }

  Promise.all(
    assetsToPrefetch.map((assetToPrefetch) => {
      return get(assetToPrefetch).then(() => {
        console.log(`Prefetch API: Prefetched asset -> ${assetToPrefetch}.`)
      })
    }),
  ).then(() => {
    console.log("Prefetch API: Sucessfully prefetched all assets.")
  })
}

export default { prefetchInit }
