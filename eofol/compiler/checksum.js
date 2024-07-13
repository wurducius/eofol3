const crypto = require("crypto")

const checksum = (str, algorithm, encoding) =>
  crypto
    .createHash(algorithm || "md5")
    .update(str, "utf8")
    .digest(encoding || "hex")

module.exports = checksum
