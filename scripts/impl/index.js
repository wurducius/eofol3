const beforeCompile = require("./before-compile")
const clean = require("./clean")
const compileTs = require("./compile-ts")
const serve = require("./serve")
const dev = require("./dev")
const logBuildSuccess = require("./build-success")

module.exports = { beforeCompile, clean, compileTs, serve, dev, logBuildSuccess }
