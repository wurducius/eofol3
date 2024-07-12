const { primary, success, error } = require("./src/chalk")
const prettySize = require("./src/pretty-size")
const prettyTime = require("./src/pretty-time")
const getDirSize = require("./src/get-dir-size")
const spawn = require("./src/spawn")

module.exports = {
  primary,
  success,
  error,
  prettySize,
  prettyTime,
  spawn,
  getDirSize,
}
