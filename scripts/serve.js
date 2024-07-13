const { serve } = require("./impl")
const { primary } = require("../eofol/dev-util")

console.log(primary("Serving build folder..."))

serve()
