const { success } = require("../../eofol/dev-util")
const { env, paths } = require("../../config")
const { PORT, HOST } = env
const { BUILD_PATH } = paths

const liveServer = require("live-server")
const { SERVE_URL } = require("../../config/env-impl")

// const SERVE_CACHE_TTL_MS = 31536000000

const SERVE_RELOAD_WAIT_TIME_MS = 250

const CORS = true

const serveOptions = {
  port: PORT,
  host: HOST,
  browser: undefined,
  https: undefined,
  open: true,
  root: BUILD_PATH,
  file: "index.html",
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
  console.log(success(`Serving Eofol3 app now at ${SERVE_URL}.`))
  liveServer.start(serveOptions)
}

module.exports = serve
