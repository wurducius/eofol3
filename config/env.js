require("dotenv").config()

const defaultEnv = require("./default-env")

const params = {}

if (process.argv.length >= 3 && process.argv[2] && process.argv[2] === "--prod") {
  params.MODE = "production"
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getPort() {
  if (process.env.PORT === "random") {
    return randomInteger(3000, 8999)
  } else if (
    !process.env.PORT ||
    Number.isNaN(process.env.PORT) ||
    !Number.isFinite(process.env.PORT) ||
    !Number.isInteger(process.env.PORT)
  ) {
    return process.env.PORT
  } else {
    return defaultEnv.PORT
  }
}

module.exports = {
  ...defaultEnv,
  ...process.env,
  ...params,
  PORT: getPort(),
}
