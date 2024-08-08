// @IMPORT-START
import Core from "../core"
const { getConfig } = Core
// @IMPORT("../core")
// @IMPORT-END

let storeWorker: Worker | undefined

const logStore = (msg: string) => console.log(`Store: ${msg}`)

const startStoreWorker = () => {
  if (typeof Worker !== "undefined") {
    if (typeof storeWorker == "undefined") {
      storeWorker = new Worker(`${getConfig().BASE_URL}store-worker.js`)
    }
    storeWorker.onmessage = (event: { data: string }) => {
      logStore(`Message received -> ${event.data}`)
    }
  } else {
    logStore("Web Worker not supported.")
  }
}

const stopStoreWorker = () => {
  if (storeWorker) {
    storeWorker.terminate()
    storeWorker = undefined
  }
}

export default { startStoreWorker, stopStoreWorker }
