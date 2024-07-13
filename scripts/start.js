const build = require("./impl/build")
const { dev } = require("./impl")

build().then(() => {
  dev()
})
