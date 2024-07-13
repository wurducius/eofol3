const fs = require("fs")
const checksum = require("./checksum")
const { primary } = require("../dev-util")

const hotUpdate = (isHot, targetPath, sourcePath, nextContent, coldHandler) => {
  const writeFile = () => {
    fs.writeFileSync(targetPath, nextContent)
  }

  if (isHot && fs.existsSync(targetPath)) {
    const prevChecksum = checksum(fs.readFileSync(targetPath).toString())
    const nextChecksum = checksum(nextContent.toString())

    if (prevChecksum !== nextChecksum) {
      console.log(primary(`Updating ${targetPath}`))
      writeFile()
    }
  } else {
    writeFile()
    if (coldHandler) {
      coldHandler()
    }
  }
}

module.exports = hotUpdate
