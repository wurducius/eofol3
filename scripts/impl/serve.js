const { success } = require("../../eofol/dev-util")
const { env, paths } = require("../../config")
const { PROTOCOL, PAGE_FALLBACK, PORT, HOST } = env
const { BUILD_PATH } = paths

const SERVE_RELOAD_WAIT_TIME_MS = 100

const CORS = true

const SERVE_URL = `${PROTOCOL}://localhost:${PORT}`

const serveOptions = {
  port: PORT,
  host: HOST,
  browser: undefined,
  https: undefined,
  open: true,
  root: BUILD_PATH,
  file: `${PAGE_FALLBACK}.html`,
  wait: SERVE_RELOAD_WAIT_TIME_MS,
  logLevel: 0,
  cors: CORS,
  middleware: [
    (req, res, next) => {
      next()
    },
  ],
}

const serve = () => {
  ;(async () => {
    const LiveServer = await import("eofol-live-server").then((f) => f.default)
    console.log(success(`Serving Eofol3 app now at ${SERVE_URL}.`))
    LiveServer.start(serveOptions)
  })().catch(console.error)
}

module.exports = serve
