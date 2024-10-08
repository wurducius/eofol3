const fs = require("fs")
const path = require("path")

const {
  prettyTime,
  config,
  isVerbose,
  PATH_VIEWS_DIST2,
  EXT_HTML,
  PATH_PAGES,
  EXT_JS,
  PATH_BUILD,
  FILENAME_SUFFIX_STATIC,
  die,
  isDirectory,
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
  touchBuildDirs,
  compileViewScript,
  copyStaticDir,
  compileCore,
  compileTheme,
  transverseTree,
  htmlTemplate,
  exists,
  read,
  readDir,
} = require("../../eofol")

const compile = (isHot) => {
  msgStepEofol("Starting Eofol3 static compilation...")

  if (isVerbose) {
    msgStepEofol(`Config = ${JSON.stringify(config, null, 2)}`)
  }

  const timeStart = new Date()

  if (!isHot) {
    touchBuildDirs()
  }

  compileTheme()

  const views = readDir(PATH_VIEWS_DIST2, { recursive: true }).filter((view) => {
    const viewPath = path.resolve(PATH_VIEWS_DIST2, view)
    const viewScriptPath = path.resolve(viewPath, `${path.basename(view)}${FILENAME_SUFFIX_STATIC}${EXT_JS}`)
    return exists(viewScriptPath) && isDirectory(viewPath)
  })

  let i = 0

  const resultPromise = views.map((view) => {
    const defs = importViewEofolDefs(view)

    const Sx = require(path.resolve(PATH_VIEWS_DIST2, view, path.basename(`${view}${FILENAME_SUFFIX_STATIC}${EXT_JS}`)))
    const { getAssets } = Sx

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
      if (!exists(sourcePath)) {
        die(`Source file doesn't exist: ${sourcePath}`, undefined)
      }
      sourceHTML = read(sourcePath)
    } catch (ex) {
      die(`Cannot open source file: ${sourcePath}`, ex)
    }

    let sxStyles = []
    let sxx

    let assets = {}

    return minifyPre(sourceHTML.toString())
      .then(parseHTMLToJSON)
      .then(htmlTemplate(view))
      .then(transverseTree(vdom, instances, memoCache, defs, sxStyles, view))
      .then((res) => {
        sxx = sxStyles.join(" ")
        assets = getAssets()
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
        writeView(source, res)
        compileViewScript(view, vdom, instances, memoCache, assets)(isHot)
        msgStepEofol(`[${i + 1}/${views.length}] Compiled ${source} in ${prettyTime(new Date() - timeStart)}`)
        i += 1
      })
  })

  return Promise.all(resultPromise)
    .then(() => copyStaticDir(isHot))
    .then(() => compileCore())
    .then(() => {
      if (isVerbose) {
        msgStepEofolSuccess(`Compiled successfully at ${PATH_BUILD} in ${prettyTime(new Date() - timeStart)}.`)
      }
    })
}

module.exports = compile
