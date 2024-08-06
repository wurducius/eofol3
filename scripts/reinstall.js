const fs = require("fs")
const { resolve } = require("path")
const { execSync, spawn } = require("child_process")
const { PATH_CWD } = require("../eofol/constants")
const { spawnOptions } = require("./impl/options")

const PATH_PACKAGE_LOCK = resolve(PATH_CWD, "package-lock.json")
const PATH_NODE_MODULES = resolve(PATH_CWD, "node_modules")

let isCacheClean = false
if (process.argv.length >= 3 && process.argv[2] && process.argv[2] === "-c") {
  isCacheClean = true
}

if (fs.existsSync(PATH_PACKAGE_LOCK)) {
  fs.rmSync(PATH_PACKAGE_LOCK)
}

if (fs.existsSync(PATH_NODE_MODULES)) {
  fs.rmSync(PATH_NODE_MODULES, { recursive: true })
}

if (isCacheClean) {
  execSync("npm cache clean --force")
}

const install = spawn("npm", ["i"], spawnOptions)

install.on("error", (data) => {
  console.log(`ERROR: ${data}`)
})
install.on("close", () => {
  process.exit(0)
})
