const { HTMLToJSON } = require("html-to-json-parser")

const { primary, success } = require("@eofol/eofol-dev-utils")

const { isVerbose } = require("../constants/compile")
const { die } = require("../util/common")

// -------------------------------------------

const MSG_EOFOL = ""
const MSG_HTML_PARSER = "HTML Parser"
const MSG_HTML_MINIFIER = "HTML Minifier"
const MSG_HTML_VALIDATOR = "HTML Validator"

const MSG_STEP_SUFFIX = ""
const msgStep = (msgSource, method) => (msg) => console.log((method ?? primary)(`${msgSource}${MSG_STEP_SUFFIX}${msg}`))

const msgStepEofol = msgStep(MSG_EOFOL)
const msgStepEofolSuccess = msgStep(MSG_EOFOL, success)
const msgStepParser = msgStep(MSG_HTML_PARSER)
const msgStepMinifier = msgStep(MSG_HTML_MINIFIER)
const msgStepValidator = msgStep(MSG_HTML_VALIDATOR)

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
