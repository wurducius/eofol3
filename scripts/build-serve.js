const { serve } = require("./impl")
const build = require("./impl/build")

build().then(() => {
  serve()
})
