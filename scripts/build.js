const build = require("./impl/build")
const { logBuildSuccess } = require("./impl")

const timeStart = new Date()

build().then(() => {
  logBuildSuccess(timeStart)
})
