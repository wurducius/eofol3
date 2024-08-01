const fs = require("fs")
const path = require("path")
const { env } = require("../../config")
const { BASE_URL } = env
const { PATH_VIEWS_DIST2, INTERNALS_VARIABLE_NAME, CODE_MODULE_EXPORTS, EXT_JS } = require("../constants")

const compileInternalImpl = (vdom, eofolInstances, memoCache, internalDir, viewName) => {
  // @TODO path relative to view dir location
  const contentObj = { vdom: vdom[0], instances: eofolInstances, memoCache }
  // @TODO remove double write
  const parsedPath = path.parse(viewName)
  const targetPath = path.resolve(PATH_VIEWS_DIST2, parsedPath.dir, parsedPath.name, `${parsedPath.name}${EXT_JS}`)
  const prevContent = fs.readFileSync(targetPath).toString()
  const parts = prevContent.split(CODE_MODULE_EXPORTS)
  const result = parts
    .map((part, i) =>
      i === parts.length - 2
        ? `${part}\n${INTERNALS_VARIABLE_NAME} = ${JSON.stringify(contentObj)}\nsetVdom(${INTERNALS_VARIABLE_NAME}.vdom)\nsetInstances(${INTERNALS_VARIABLE_NAME}.instances)\nsetMemoCache(${INTERNALS_VARIABLE_NAME}.memoCache)\nsetConfig(${JSON.stringify({ BASE_URL })})`
        : part,
    )
    .join(`\n${CODE_MODULE_EXPORTS} `)
  fs.writeFileSync(targetPath, result, "utf8")
}

module.exports = compileInternalImpl
