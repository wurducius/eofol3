const clean = require("./clean")
const compileTs = require("./compile-ts")
const beforeCompile = require("./before-compile")
const compile = require("./compile")

const build = () => {
  // 1. CLEAN

  clean()

  // 2. COMPILE TS

  compileTs()

  // 3. BEFORE COMPILE

  beforeCompile()

  // 4. COMPILE

  return compile(false)
}

module.exports = build
