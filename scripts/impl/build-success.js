const { success, prettySize, getDirSize, prettyTime } = require("../../eofol/dev-util")
const { PATH_BUILD } = require("../../eofol/constants")

const logBuildSuccess = (timeStart) => {
  console.log(
    success(
      `Project successfully built at ${PATH_BUILD}. Total bundle size: ${prettySize(getDirSize(PATH_BUILD))}. Building took ${prettyTime(new Date() - timeStart)}.`,
    ),
  )
}

module.exports = logBuildSuccess
