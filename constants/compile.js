const argsConfig = {
  minifyHTML: true,
  minifyRegistryJSON: true,
  verbose: false,
  production: true,
}
const defaultConfig = {
  production: false,
  minifyHTML: false,
  minifyRegistryJSON: false,
  verbose: false,
}
const config = { ...defaultConfig, ...argsConfig }
if (argsConfig.production) {
  config.minifyHTML = true
  config.minifyRegistryJSON = true
}
const isVerbose = config.verbose

const minifyOptions = {
  continueOnParseError: true,
  removeComments: true,
  minifyHTML: config.minifyHTML,
  minifyCSS: config.minifyHTML,
  minifyJS: config.minifyHTML,
  minifyURLs: config.minifyHTML,
  processScripts: config.minifyHTML,
  collapseWhitespace: config.minifyHTML,
  collapseInlineTagWhitespace: true,
  collapseBooleanAttributes: true,
  noNewlinesBeforeTagClose: true,
  sortAttributes: true,
  sortClassName: true,
}

const minifyHTMLOptions = { removeComments: true }

module.exports = { config, isVerbose, minifyOptions, minifyHTMLOptions }
