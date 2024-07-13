const afterBuild = require("./after-build")
const common = require("./common")
const compile = require("./compile")
const paths = require("./paths")

const CODE_MODULE_EXPORTS = "module.exports"

module.exports = { ...afterBuild, ...common, ...compile, ...paths, CODE_MODULE_EXPORTS }
