const validator = require("html-validator")

const { die } = require("../util/common")
const { msgStepValidator } = require("../compiler/log")
const { isVerbose } = require("../constants/compile")

const validate = (res) => {
  const options = {
    format: "text",
    data: res,
  }

  try {
    validator(options)
    if (isVerbose) {
      msgStepValidator("Valid HTML")
    }
  } catch (ex) {
    die("Invalid HTML", ex)
  }

  return res
}

module.exports = validate
