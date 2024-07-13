const { serve } = require("./impl")
const build = require("./impl/build")

build()

const args = []
serve(args)
