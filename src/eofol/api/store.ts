// @IMPORT-START
import Core from "../core"
const { getConfig } = Core
// @IMPORT("../core")
// @IMPORT-END

let storeWorker: Worker | undefined

const startStoreWorker = () => {
  if (typeof Worker !== "undefined") {
    if (typeof storeWorker == "undefined") {
      // @ts-ignore
      storeWorker = new Worker(`${getConfig().BASE_URL}store-worker.js`)
    }
    storeWorker.onmessage = (event: { data: string }) => {
      console.log(`Message received -> ${event.data}`)
    }
  } else {
    console.log("Store: Web Worker not supported.")
  }
}

const stopStoreWorker = () => {
  if (storeWorker) {
    storeWorker.terminate()
    storeWorker = undefined
  }
}

export default { startStoreWorker, stopStoreWorker }
