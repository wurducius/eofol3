const fs = require("fs")
const { error, spawn } = require("../../eofol/dev-util")
const { env, paths } = require("../../config")

const { PORT } = env
const { BUILD_PATH } = paths

const SERVE_CACHE_TTL_MS = 31536000000

const liveServer = require("live-server")

const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const serve = async (silent, args) => {
  /*
  if (fs.existsSync(BUILD_PATH)) {
    const result = await spawn(
      "http-server",
      // @TODO EXTRACT ./build from env paths
      ["./build", "-p", PORT, "-a", "0.0.0.0", "-g", "-c", SERVE_CACHE_TTL_MS, "--cors", "-o", silent && "-s", args]
        .flat()
        .filter(Boolean),
      {
        stdio: "inherit",
      },
    )

    return result
    // process.exit(result.status)
  } else {
    console.log(error("Build folder not found. Please run 'npm run build' first."))
  }
   */

  const params = {
    port: randomInteger(3000, 8999), // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: "./build", // Set root directory that's being served. Defaults to cwd.
    open: true, // When false, it won't load your browser by default.
    ignore: "scss,my/templates", // comma-separated string for paths to ignore
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 500, // Waits for all changes, before reloading. Defaults to 0 sec.
    //  mount: [["./node_modules"]], // Mount a directory to a route.
    logLevel: 1, // 0 = errors only, 1 = some, 2 = lots
    middleware: [
      function (req, res, next) {
        next()
      },
    ], // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
  }
  liveServer.start(params)
}

module.exports = serve
