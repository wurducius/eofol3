const { primary, success } = require("../../eofol/dev-util")
const Watchpack = require("watchpack")
const serve = require("./serve")
const compileTs = require("./compile-ts")
const beforeCompile = require("./before-compile")
const compile = require("./compile")
const afterCompile = require("./after-compile")
const cleanHot = require("./clean-hot")

const watchpackOptions = {
  aggregateTimeout: 250,
  poll: true,
  followSymlinks: true,
  ignored: "**/.git",
}

// @TODO extract dirnames from env
const listOfDirectories = ["src", "pages", "static"]

const recompile = async () => {
  console.log(primary("Recompiling..."))
  cleanHot()
  const args = []
  compileTs(args)
  beforeCompile()
  return await compile().then(() => {
    afterCompile(true)
    console.log(success("Recompiled!"))
  })
}

const handleChange = async () => {
  // (filePath, mtime, explanation)
  // console.log(`CHANGE -> ${filePath} @ ${mtime} -> explanation: ${explanation}`)
  await recompile()
}

const handleRemove = async () => {
  // (filePath, explanation)
  // console.log(`DELETED -> ${filePath} -> explanation: ${explanation}`)
  await recompile()
}

const listOfFiles = []
const listOfNotExistingItems = []

const dev = () => {
  console.log(primary("Starting the development server..."))

  process.on("SIGINT", () => {
    console.log(primary("Shutting down development server..."))
    wp.close()
    console.log(primary("Development server shut down."))
    process.exit(0)
  })

  const wp = new Watchpack(watchpackOptions)

  wp.watch({
    files: listOfFiles,
    directories: listOfDirectories,
    missing: listOfNotExistingItems,
    startTime: Date.now() - 10000,
  })

  wp.on("change", handleChange)
  wp.on("remove", handleRemove)

  serve()

  // console.log(
  //        primary(`Serving eofol app ${appName} in ${MODE} mode at `) +
  //          success(SERVE_URL)
  //      );
}

module.exports = dev
