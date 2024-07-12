const append = require("./append")
const babelize = require("./babelize")
const gzip = require("./gzip")
const compileImg = require("./img")
const writeInternal = require("./internal")
const Log = require("./log")
const Minify = require("./minify")
const parseHTMLToJSON = require("./parse")
const copyPublicDir = require("./public")
const compileScript = require("./script")
const compileStyle = require("./style")
const transverseTree = require("./traverse-tree")
const validate = require("./validate")

module.exports = {
  append,
  babelize,
  gzip,
  compileImg,
  writeInternal,
  ...Log,
  ...Minify,
  parseHTMLToJSON,
  copyPublicDir,
  compileScript,
  compileStyle,
  transverseTree,
  validate,
}
