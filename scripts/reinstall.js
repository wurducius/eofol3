const fs = require("fs")
const { resolve } = require("path")
const { spawn } = require("../eofol/dev-util")
const { PATH_CWD } = require("../eofol/constants")

const PATH_PACKAGE_LOCK = resolve(PATH_CWD, "package-lock.json")
const PATH_NODE_MODULES = resolve(PATH_CWD, "node_modules")

const spawnOptions = {
  stdio: "inherit",
}

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
  spawn.sync("npm", ["cache", "clean", "--force"], spawnOptions)
}

spawn.sync("npm", ["install"], spawnOptions)
