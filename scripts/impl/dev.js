const Watchpack = require("watchpack")
const serve = require("./serve")
const compileTs = require("./compile-ts")
const beforeCompile = require("./before-compile")
const compile = require("./compile")
const cleanHot = require("./clean-hot")
const { env } = require("../../config")
const { PROTOCOL, PORT } = env
const { DIRNAME_SRC, DIRNAME_PAGES, DIRNAME_STATIC, success, primary } = require("../../eofol")

const watchpackOptions = {
  aggregateTimeout: 250,
  poll: true,
  followSymlinks: true,
  ignored: "**/.git",
}

const listOfDirectories = [DIRNAME_SRC, DIRNAME_PAGES, DIRNAME_STATIC]

const SERVE_URL = `${PROTOCOL}://localhost:${PORT}`

const recompile = async () => {
  console.log(primary("Recompiling..."))
  cleanHot()
  compileTs()
  beforeCompile()
  return await compile(true).then(() => {
    console.log(success(`Recompiled! Serving Eofol3 app now at ${SERVE_URL}.`))
  })
}

const handleChange = async () => {
  await recompile()
}

const handleRemove = async () => {
  await recompile()
}

const listOfFiles = []
const listOfNotExistingItems = []

const dev = () => {
  console.log(primary("Starting the development server..."))

  const wp = new Watchpack(watchpackOptions)

  const handleClose = () => {
    console.log(primary("\nShutting down development server..."))
    wp.close()
    console.log(primary("Development server shut down."))
    process.exit(0)
  }

  process.on("SIGINT", handleClose)
  process.on("SIGTERM", handleClose)
  process.on("SIGQUIT", handleClose)

  wp.watch({
    files: listOfFiles,
    directories: listOfDirectories,
    missing: listOfNotExistingItems,
    startTime: Date.now() - 10000,
  })

  wp.on("change", handleChange)
  wp.on("remove", handleRemove)

  serve()
}

module.exports = dev
