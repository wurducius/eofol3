const { primary, success, error } = require("./src/chalk")
const prettySize = require("./src/pretty-size")
const prettyTime = require("./src/pretty-time")
const spawn = require("./src/spawn")

module.exports = {
  primary,
  success,
  error,
  prettySize,
  prettyTime,
  spawn,
}
