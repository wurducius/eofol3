const fs = require("fs")
const checksum = require("./checksum")
const { primary } = require("../dev-util")

const cache = {}

const hotUpdate = (isHot, targetPath, sourcePath, nextContent, coldHandler) => {
  const writeFile = () => {
    fs.writeFileSync(targetPath, nextContent)
  }

  if (isHot && fs.existsSync(targetPath)) {
    const cached = cache[targetPath]

    let prevChecksum
    if (cached) {
      prevChecksum = cached
    } else {
      prevChecksum = checksum(fs.readFileSync(targetPath).toString())
    }
    const nextChecksum = checksum(nextContent.toString())

    if (prevChecksum !== nextChecksum) {
      console.log(primary(`Updating ${targetPath}`))
      cache[targetPath] = nextChecksum
      writeFile()
    } else {
      if (!cached) {
        cache[targetPath] = prevChecksum
      }
    }
  } else {
    writeFile()
    if (coldHandler) {
      coldHandler()
    }
  }
}

module.exports = hotUpdate
