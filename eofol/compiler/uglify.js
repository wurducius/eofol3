const { minify } = require("uglify-js")
const { uglifyOptions } = require("../constants")

const uglify = (content) => minify(content, uglifyOptions).code

module.exports = uglify
