const appendDoctype = require("./append-doctype")
const babelize = require("./babelize")
const compileImg = require("./img")
const compileScripts = require("./script")
const compileStyle = require("./style")
const gzip = require("./gzip")
const importViewEofolDefs = require("./import-defs")
const parseHTMLToJSON = require("./parse-html-to-json")
const parseJSONToHTML = require("./parse-json-to-html")
const precompile = require("./precompile")
const touchBuildDirs = require("./touch-build-dirs")
const uglify = require("./uglify")
const validateHTML = require("./validate-html")
const writeInternal = require("./write-internal")
const writeView = require("./write-view")

const Copy = require("./copy")
const Log = require("./log")
const Minify = require("./minify")

module.exports = {
  appendDoctype,
  babelize,
  compileImg,
  compileScripts,
  compileStyle,
  gzip,
  importViewEofolDefs,
  parseHTMLToJSON,
  parseJSONToHTML,
  precompile,
  touchBuildDirs,
  uglify,
  validateHTML,
  writeInternal,
  writeView,
  ...Copy,
  ...Log,
  ...Minify,
}
