const build = require("./impl/build")
const { dev, logBuildSuccess } = require("./impl")

const timeStart = new Date()

build().then(() => {
  logBuildSuccess(timeStart)
  dev()
})
