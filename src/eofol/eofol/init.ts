// @IMPORT-START
import Common from "./common"
const { isBrowser } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import EofolConfigRuntime from "./eofol-config-runtime"
const { SERVICE_WORKER_REGISTER_AT_INIT, SERVICE_WORKER_SCRIPT_FILENAME } = EofolConfigRuntime
// @IMPORT("./eofol-config-runtime")
// @IMPORT-END

// @IMPORT-START
import ServiceWorker from "../api/service-worker"
const { registerServiceworker } = ServiceWorker
// @IMPORT("../api/service-worker")
// @IMPORT-END

// @IMPORT-START
import Prefetch from "../api/prefetch"
const { prefetch } = Prefetch
// @IMPORT("../api/prefetch")
// @IMPORT-END

// @IMPORT-START
import Lifecycle from "../components/lifecycle"
const { replayInitialEffects } = Lifecycle
// @IMPORT("../components/lifecycle")
// @IMPORT-END

const onLoad = () => {
  replayInitialEffects()
  prefetch()
}

const initEofol = () => {
  if (isBrowser()) {
    window.onload = onLoad
  }

  if (SERVICE_WORKER_REGISTER_AT_INIT) {
    // @TODO allow relative path from view page
    registerServiceworker(`/${SERVICE_WORKER_SCRIPT_FILENAME}`)
  }
}

export default { initEofol }