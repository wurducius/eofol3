const afterBuild = require("./after-build")
const common = require("./common")
const compile = require("./compile")
const paths = require("./paths")

module.exports = { ...afterBuild, ...common, ...compile, ...paths }
