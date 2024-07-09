const fs = require("fs")

const gzip = require("gzip-js")
const { COMPRESS_GZIP_LEVEL } = require("../constants/after-build")

const gzipOptions = {
  level: COMPRESS_GZIP_LEVEL,
}

const byteArrayToString = (bytes) => String.fromCharCode.apply(null, bytes)

const zip = (sourcePath, targetPath, filename) => {
  fs.writeFileSync(
    targetPath,
    byteArrayToString(
      gzip.zip(fs.readFileSync(sourcePath), {
        ...gzipOptions,
        name: filename,
        timestamp: parseInt(Date.now() / 1000, 10),
      }),
    ),
  )
}

module.exports = zip
