const { spawn } = require("../../eofol/dev-util")
const { spawnOptions } = require("./options")

const compileTs = () => {
  spawn.sync("tsc", ["--project", "./tsconfig.json"], spawnOptions)
}

module.exports = compileTs
