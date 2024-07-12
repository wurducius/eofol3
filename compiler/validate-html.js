const validator = require("html-validator")

const { die } = require("../util")
const { msgStepValidator } = require("./log")
const { isVerbose } = require("../constants")

const validateHTML = (res) => {
  try {
    // @TODO fix await promise
    validator({
      format: "text",
      data: res,
    })
    if (isVerbose) {
      msgStepValidator("Valid HTML")
    }
  } catch (ex) {
    die("Invalid HTML", ex)
  }
  return res
}

module.exports = validateHTML
