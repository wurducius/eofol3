const fs = require("fs")
const path = require("path")

const { prettyTime } = require("../../eofol/dev-util")
const {
  config,
  isVerbose,
  PATH_DERIVED,
  PATH_VIEWS_DIST2,
  EXT_HTML,
  PATH_PAGES,
  EXT_JS,
  DIRNAME_EOFOL_INTERNAL,
} = require("../../eofol/constants")
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
const htmlTemplate = require("../../eofol/api/head/head")
const { isDirectory } = require("../../eofol/util/fs")

const compile = () => {
  msgStepEofol("Starting Eofol3 static compilation...")

  if (isVerbose) {
    msgStepEofol(`Config = ${JSON.stringify(config, null, 2)}`)
  }

  const timeStart = new Date()

  checkExistsCreate(PATH_DERIVED)
  checkExistsCreate(path.resolve(PATH_DERIVED, DIRNAME_EOFOL_INTERNAL))

  const views = fs.readdirSync(PATH_VIEWS_DIST2, { recursive: true }).filter((view) => {
    const viewPath = path.resolve(PATH_VIEWS_DIST2, view)
    const viewScriptPath = path.resolve(viewPath, `${path.basename(view)}${EXT_JS}`)
    return fs.existsSync(viewScriptPath) && isDirectory(viewPath)
  })

  let i = 0

  const resultPromise = views.map((view) => {
    const defs = importViewEofolDefs(view)

    const Sx = require(path.resolve(PATH_VIEWS_DIST2, view, path.basename(view + EXT_JS)))
    const { clearCompileCache } = Sx

    const source = fs
      .readdirSync(PATH_PAGES, { recursive: true })
      .filter((sourceFilename) => sourceFilename.endsWith(EXT_HTML))
      .find((filename) => filename.replace(EXT_HTML, "") === view)

    const instances = {}
    const vdom = []
    const memoCache = {}

    const sourcePath = path.resolve(PATH_PAGES, source)
    let sourceHTML
    try {
      if (!fs.existsSync(sourcePath)) {
        die(`Source file doesn't exist: ${sourcePath}`, undefined)
      }
      sourceHTML = fs.readFileSync(sourcePath)
    } catch (ex) {
      die(`Cannot open source file: ${sourcePath}`, ex)
    }

    let sxStyles = []
    let sxx

    return minifyPre(sourceHTML.toString())
      .then(parseHTMLToJSON)
      .then(htmlTemplate(view))
      .then(transverseTree(vdom, instances, memoCache, defs, sxStyles, view))
      .then((res) => {
        sxx = sxStyles.join(" ")
        return res
      })
      .then(parseJSONToHTML)
      .then((res) => {
        return compileStyle(view, sxx)(res)
      })
      .then(minifyPost)
      .then(appendDoctype)
      .then(relativizeHtml)
      .then((res) => {
        writeView(source, res, vdom, instances, memoCache)
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

module.exports = compile
