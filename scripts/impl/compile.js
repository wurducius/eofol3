const fs = require("fs")
const path = require("path")

const { prettyTime } = require("../../eofol/dev-util")
const { config, isVerbose, PATH_DERIVED, PATH_VIEWS_DIST2, EXT_HTML } = require("../../eofol/constants")
const { checkExistsCreate, die } = require("../../eofol/util")
const {
  compileStyle,
  minifyPre,
  minifyPost,
  parseHTMLToJSON,
  msgStepEofol,
  msgStepEofolSuccess,
  appendDoctype,
  parseJSONToHTML,
  importViewEofolDefs,
  writeView,
  relativizeHtml,
} = require("../../eofol/compiler")
const transverseTree = require("../../eofol/transverseTree/transverseTree")
const { PATH_PAGES } = require("../../eofol/constants/paths")

/*
const Sx = require("../../dist2/eofol/core")
const { clearCompileCache, getCompileCache } = Sx
*/

const compile = () => {
  msgStepEofol("Starting Eofol3 static compilation...")

  if (isVerbose) {
    msgStepEofol(`Config = ${JSON.stringify(config, null, 2)}`)
  }

  const timeStart = new Date()

  checkExistsCreate(PATH_DERIVED)

  const views = fs.readdirSync(PATH_VIEWS_DIST2)

  let i = 0

  const resultPromise = views.map((view) => {
    const defs = importViewEofolDefs(view)

    const source = fs
      .readdirSync(PATH_PAGES, { recursive: true })
      .filter((sourceFilename) => sourceFilename.endsWith(EXT_HTML))
      .find((filename) => filename.replace(EXT_HTML, "") === view)

    const instances = {}
    const vdom = []

    const sourcePath = path.resolve(PATH_PAGES, source)
    let sourceHTML
    try {
      if (!fs.existsSync(sourcePath)) {
        die(`Source file doesn't exist: ${sourcePath}`)
      }
      sourceHTML = fs.readFileSync(sourcePath)
    } catch (ex) {
      die(`Cannot open source file: ${sourcePath}`, ex)
    }

    // clearCompileCache()

    return minifyPre(sourceHTML.toString())
      .then(parseHTMLToJSON(view))
      .then(transverseTree(vdom, instances, defs))
      .then(parseJSONToHTML)
      .then(compileStyle(view, []))
      .then(minifyPost)
      .then(appendDoctype)
      .then(relativizeHtml)
      .then((res) => {
        writeView(source, res, vdom, instances)
        msgStepEofol(`[${i + 1}/${views.length}] Compiled ${source} in ${prettyTime(new Date() - timeStart)}`)
        i += 1
      })
  })

  return Promise.all(resultPromise).then(() => {
    if (isVerbose) {
      msgStepEofolSuccess(`Compiled successfully at ${PATH_DERIVED} in ${prettyTime(new Date() - timeStart)}.`)
    }
  })
}

module.exports = async () => {
  await compile()
}
