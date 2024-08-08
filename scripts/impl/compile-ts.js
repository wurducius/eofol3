const { spawn } = require("../../eofol")
const { spawnOptions } = require("./options")

const compileTs = () => {
  spawn.sync("tsc", ["--project", "./tsconfig.json"], spawnOptions)
}

module.exports = compileTs
