const Common = require("./common")
const Fs = require("./fs")
const Func = require("./func")
const mergeDeep = require("./merge-deep")

module.exports = { ...Common, ...Fs, ...Func, mergeDeep }
