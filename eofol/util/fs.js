const fs = require("fs")
const path = require("path")

const checkExistsCreate = (pathToCheck) => {
  if (!fs.existsSync(pathToCheck)) {
    fs.mkdirSync(pathToCheck, { recursive: true })
  }
}

const removeFilePart = (dirname) => path.parse(dirname).dir

const isDirectory = (path) => fs.lstatSync(path).isDirectory()

module.exports = { checkExistsCreate, removeFilePart, isDirectory }
