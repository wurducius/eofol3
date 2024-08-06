const { copyStaticDir, copyPages } = require("../../eofol/compiler")

const afterCompile = (isHot) => {
  return copyStaticDir(isHot).then(() => {
    copyPages(isHot)
  })
}

module.exports = afterCompile
