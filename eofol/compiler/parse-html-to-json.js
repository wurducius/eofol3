const { HTMLToJSON } = require("html-to-json-parser")

const { isVerbose } = require("../constants")
const { die } = require("../util")
const { msgStepParser } = require("./log")

const parseHTMLToJSON = (res) =>
  HTMLToJSON(res.toString(), false)
    .then((res) => {
      if (isVerbose) {
        msgStepParser("Parse successful")
      }
      return res
    })
    .catch((ex) => {
      die("Parse error", ex)
    })

module.exports = parseHTMLToJSON
