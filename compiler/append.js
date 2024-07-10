const { config } = require("../constants/compile")

const HTML_DOCTYPE_TAG = `<!DOCTYPE html>${config.minifyHTML ? "" : "\n"}`

const append = (res) => HTML_DOCTYPE_TAG + res

module.exports = append
