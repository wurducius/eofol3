const fs = require("fs")
const path = require("path")

const getDirSize = (dirPath) => {
  let size = 0
  const files = fs.readdirSync(dirPath)

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dirPath, files[i])
    const stats = fs.statSync(filePath)

    if (stats.isFile()) {
      size += stats.size
    } else if (stats.isDirectory()) {
      size += getDirSize(filePath)
    }
  }

  return size
}

module.exports = getDirSize
