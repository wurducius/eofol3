const { PATH_BUILD, success, prettySize, getDirSize, prettyTime } = require("../../eofol")

const logBuildSuccess = (timeStart) => {
  console.log(
    success(
      `Project successfully built at ${PATH_BUILD}. Total bundle size: ${prettySize(getDirSize(PATH_BUILD))}. Building took ${prettyTime(new Date() - timeStart)}.`,
    ),
  )
}

module.exports = logBuildSuccess
