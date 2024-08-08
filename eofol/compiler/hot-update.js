const checksum = require("./checksum")
const { primary } = require("../dev-util")
const { exists, read, write } = require("../util/fs")

const cache = {}

const hotUpdate = (isHot, targetPath, sourcePath, nextContent, coldHandler) => {
  const writeFile = () => {
    write(targetPath, nextContent)
  }

  if (isHot && exists(targetPath)) {
    const cached = cache[targetPath]

    let prevChecksum
    if (cached) {
      prevChecksum = cached
    } else {
      prevChecksum = checksum(read(targetPath).toString())
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
