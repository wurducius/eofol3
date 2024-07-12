const { HTMLToJSON } = require("html-to-json-parser")

const { isVerbose } = require("../constants")
const { die } = require("../util")
const { msgStepParser } = require("./log")
const htmlTemplate = require("../api/head")

const parseHTMLToJSON = (view) => (res) =>
  HTMLToJSON(res.toString(), false)
    .then((res) => {
      if (isVerbose) {
        msgStepParser("Parse successful")
      }
      return htmlTemplate(res, view)
    })
    .catch((ex) => {
      die("Parse error", ex)
    })

module.exports = parseHTMLToJSON
