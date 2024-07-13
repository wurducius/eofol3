const { env, paths } = require("../../config")
const { PORT, HTTPS, BROWSER, HOST } = env
const { BUILD_PATH } = paths

const liveServer = require("live-server")

// const SERVE_CACHE_TTL_MS = 31536000000

const SERVE_RELOAD_WAIT_TIME_MS = 250

const CORS = true

const serveOptions = {
  port: PORT,
  host: HOST,
  root: BUILD_PATH,
  open: true,
  file: "index.html",
  wait: SERVE_RELOAD_WAIT_TIME_MS,
  logLevel: 0,
  cors: CORS,
  https: HTTPS === "https",
  middleware: [
    (req, res, next) => {
      next()
    },
  ],
}

const serve = () => {
  liveServer.start(serveOptions)
}

module.exports = serve
