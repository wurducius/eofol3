const clean = require("./clean")
const compileTs = require("./compile-ts")
const beforeCompile = require("./before-compile")
const compile = require("./compile")
const afterCompile = require("./after-compile")

const build = () => {
  // 1. CLEAN

  clean()

  // 2. COMPILE TS

  const args = []
  compileTs(args)

  // 3. BEFORE COMPILE

  beforeCompile()

  // 4. COMPILE

  return compile().then(() => {
    // 5. AFTER COMPILE

    afterCompile(false)
  })
}

module.exports = build
