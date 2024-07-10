const { success, primary } = require("@eofol/eofol-dev-utils")

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

module.exports = { msgStepEofol, msgStepEofolSuccess, msgStepMinifier, msgStepParser, msgStepValidator }
