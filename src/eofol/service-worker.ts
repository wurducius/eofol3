// @IMPORT-START
import Common from "./common"
const { isBrowser } = Common
// @IMPORT("./common")
// @IMPORT-END

const registerServiceworker = (serviceworkerPath: string) => {
  if (isBrowser() && "serviceWorker" in navigator) {
    navigator.serviceWorker.register(serviceworkerPath)
  }
}

export default { registerServiceworker }
