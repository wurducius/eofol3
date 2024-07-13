const { serve } = require("./impl")
const { primary } = require("../eofol/dev-util")

console.log(primary("Serving build folder..."))

const args = process.argv.slice(2)
serve(false, args)
