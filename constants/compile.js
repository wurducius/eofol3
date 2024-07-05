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
  removeRedundantAttributes: true,
  removeComments: true,
  collapseWhitespace: config.minifyHTML,
  collapseInlineTagWhitespace: true,
  noNewlinesBeforeTagClose: true,
  removeTagWhitespace: true,
  minifyCSS: config.minifyHTML,
  minifyJS: config.minifyHTML,
  processScripts: config.minifyHTML,
  minifyHTML: config.minifyHTML,
  minifyURLs: config.minifyHTML,
  collapseBooleanAttributes: true,
  sortAttributes: true,
  sortClassName: true,
  removeOptionalTags: true,
}
module.exports = { config, isVerbose, minifyOptions }
