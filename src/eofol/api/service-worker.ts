// @IMPORT-START
import Common from "../eofol/common"
const { isBrowser } = Common
// @IMPORT("../eofol/common")
// @IMPORT-END

const registerServiceworker = (serviceworkerPath: string) => {
  if (isBrowser() && "serviceWorker" in navigator) {
    navigator.serviceWorker.register(serviceworkerPath)
  }
}

export default { registerServiceworker }
