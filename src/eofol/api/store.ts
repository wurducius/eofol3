let storeWorker: Worker | undefined

const startStoreWorker = () => {
  if (typeof Worker !== "undefined") {
    if (typeof storeWorker == "undefined") {
      storeWorker = new Worker("store-worker.js")
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
