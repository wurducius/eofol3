const fs = require("fs")
const path = require("path")
const { FILENAME_SUFFIX_EOFOL_INTERNALS } = require("../constants/paths")
const { config } = require("../constants/compile")

const compileInternalImpl = (vdom, eofolInstances, internalDir, viewName) => {
  // @TODO path relative to view dir location
  const targetPath = path.resolve(internalDir, `${viewName}${FILENAME_SUFFIX_EOFOL_INTERNALS}`)
  const contentObj = { vdom: vdom[0], instances: eofolInstances }
  const content = JSON.stringify(contentObj, null, config.minifyRegistryJSON ? 0 : 2)
  fs.writeFileSync(targetPath, content)
}

module.exports = compileInternalImpl
