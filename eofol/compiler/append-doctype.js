const { config } = require("../constants")

const HTML_DOCTYPE_TAG = `<!DOCTYPE html>${config.minifyHTML ? "" : "\n"}`

const appendDoctype = (res) => HTML_DOCTYPE_TAG + res

module.exports = appendDoctype
