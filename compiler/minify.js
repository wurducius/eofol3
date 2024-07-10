const { minify } = require("html-minifier-terser")

const { isVerbose, minifyOptions, minifyHTMLOptions } = require("../constants/compile")

const minifyImpl = (options) => (res) =>
  minify(res, options)
    .catch((ex) => {
      die("Minify error", ex)
    })
    .then((res) => {
      if (isVerbose) {
        msgStepMinifier("Minified successfully")
      }
      return res
    })

const minifyPre = minifyImpl(minifyHTMLOptions)

const minifyPost = minifyImpl(minifyOptions)

module.exports = { minifyPre, minifyPost }
