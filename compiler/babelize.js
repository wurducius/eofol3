const babel = require("@babel/core")
const { babelOptions } = require("../constants")

const babelize = (content) => babel.transformSync(content, babelOptions).code.toString()

module.exports = babelize
