const { env } = require("../../config")
const { BASE_URL } = env
const { INTERNALS_VARIABLE_NAME, CODE_MODULE_EXPORTS } = require("../constants")

const compileInternalImpl = (vdom, eofolInstances, memoCache, assets) => (prevContent) => {
  const contentObj = { vdom: vdom[0], instances: eofolInstances, memoCache, assets }
  const config = JSON.stringify({ BASE_URL })
  const parts = prevContent.split(CODE_MODULE_EXPORTS)
  return parts
    .map((part, i) =>
      i === parts.length - 2
        ? `${part}\n${INTERNALS_VARIABLE_NAME} = ${JSON.stringify(contentObj)}\nsetVdom(${INTERNALS_VARIABLE_NAME}.vdom)\nsetInstances(${INTERNALS_VARIABLE_NAME}.instances)\nsetMemoCache(${INTERNALS_VARIABLE_NAME}.memoCache)\nsetConfig(${config})\nsetAssets(${INTERNALS_VARIABLE_NAME}.assets)`
        : part,
    )
    .join(`\n${CODE_MODULE_EXPORTS} `)
}

module.exports = compileInternalImpl
