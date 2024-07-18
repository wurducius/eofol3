const { serve } = require("./impl")
const build = require("./impl/build")
const { logBuildSuccess } = require("./impl")

const timeStart = new Date()

build().then(() => {
  logBuildSuccess(timeStart)
  serve()
})
