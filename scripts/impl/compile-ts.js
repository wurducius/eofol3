const { spawn } = require("../../eofol/dev-util")

const spawnOptions = {
  stdio: "inherit",
}

const compileTs = () => {
  spawn.sync("tsc", ["--project", "./tsconfig.json"], spawnOptions)
}

module.exports = compileTs
