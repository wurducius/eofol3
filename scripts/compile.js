const fs = require("fs")
const path = require("path")

const { JSONToHTML } = require("html-to-json-parser")

const { prettyTime } = require("@eofol/eofol-dev-utils")

const { config, isVerbose } = require("../constants/compile")
const { PATH_DERIVED, PATH_PUBLIC, PATH_VIEWS_DIST, DIRNAME_EOFOL_INTERNAL } = require("../constants/paths")
const { EXT_HTML, EXT_JS } = require("../constants/common")
const { die } = require("../util/common")
const writeInternal = require("../compiler/internal")
const compileStyle = require("../compiler/style")
const parseHTMLToJSON = require("../compiler/parse")
const { minifyPre, minifyPost } = require("../compiler/minify")
const validate = require("../compiler/validate")
const { msgStepEofol, msgStepEofolSuccess } = require("../compiler/log")
const traverseTreeAsync = require("../compiler/traverse-tree")
const append = require("../compiler/append")
const { checkExistsCreate, removeFilePart } = require("../util/fs")

msgStepEofol("Starting Eofol3 static compilation...")

if (isVerbose) {
  msgStepEofol(`Config = ${JSON.stringify(config, null, 2)}`)
}

const timeStart = new Date()

const views = fs.readdirSync(PATH_VIEWS_DIST)

checkExistsCreate(PATH_DERIVED)

let i = 0

const resultPromise = views.map((view) => {
  const eofolDefsJS = require(path.resolve(PATH_VIEWS_DIST, view, view + EXT_JS))
  const eofolDefs = Object.keys(eofolDefsJS).map((eofolDefJS) => eofolDefsJS[eofolDefJS])

  const source = fs
    .readdirSync(PATH_PUBLIC, { recursive: true })
    .filter((sourceFilename) => sourceFilename.endsWith(EXT_HTML))
    .find((filename) => filename.replace(".html", "") === view)

  return new Promise(() => {
    const eofolInstances = []
    const vdom = []

    const sourcePath = path.resolve(PATH_PUBLIC, source)
    let sourceHTML
    try {
      if (!fs.existsSync(sourcePath)) {
        die(`Source file doesn't exist: ${sourcePath}`)
      }
      sourceHTML = fs.readFileSync(sourcePath)
    } catch (ex) {
      die(`Cannot open source file: ${sourcePath}`, ex)
    }

    return new Promise(() =>
      minifyPre(sourceHTML.toString())
        .then(parseHTMLToJSON)
        .then(traverseTreeAsync(vdom, eofolInstances, eofolDefs))
        .then(JSONToHTML)
        .then(compileStyle(view))
        .then(minifyPost)
        .then(validate)
        .then(append)
        .then((res) => {
          const targetPath = path.resolve(PATH_DERIVED, source)
          const targetDir = removeFilePart(targetPath)
          checkExistsCreate(targetDir)
          fs.writeFileSync(targetPath, res)
          const internalDir = path.resolve(targetDir, DIRNAME_EOFOL_INTERNAL)
          checkExistsCreate(internalDir)
          writeInternal(vdom, eofolInstances, internalDir, path.parse(source).name)
          msgStepEofol(`[${i + 1}/${views.length}] Compiled ${source} in ${prettyTime(new Date() - timeStart)}`)
          i += 1
          return res
        }),
    )
  })
})

Promise.all(resultPromise).then(() => {
  msgStepEofolSuccess(`Compiled successfully at ${PATH_DERIVED} in ${prettyTime(new Date() - timeStart)}.`)
})
