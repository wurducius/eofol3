const fs = require("fs")
const path = require("path")

const { HTMLToJSON, JSONToHTML } = require("html-to-json-parser")
const { minify } = require("html-minifier-terser")
const validator = require("html-validator")

const { prettyTime, primary, success } = require("@eofol/eofol-dev-utils")

const { config, isVerbose, minifyOptions } = require("../constants/compile")
const {
  PATH_DERIVED,
  PATH_PUBLIC,
  PATH_VIEWS_DIST,
  DIRNAME_EOFOL_INTERNAL,
  PATH_VIEWS_SRC,
} = require("../constants/paths")
const { EXT_HTML, EXT_JS, EXT_CSS } = require("../constants/common")
const { die } = require("../util/common")
const { checkExistsCreate, removeFilePart } = require("../util/fs")
const writeInternal = require("../compiler/internal")
const {
  getEofolComponentType,
  validateEofolCustomElement,
  isEofolCustomElement,
  isEofolFlatElement,
  isEofolStaticElement,
  renderEofolCustomElement,
  renderEofolFlatElement,
  renderEofolStaticElement,
} = require("../dist/eofol/core")

// -------------------------------------------

const minifyHTMLOptions = { removeComments: true }

const HTML_DOCTYPE_TAG = `<!DOCTYPE html>${config.minifyHTML ? "" : "\n"}`

const MSG_EOFOL = ""
const MSG_HTML_PARSER = "HTML Parser"
const MSG_HTML_MINIFIER = "HTML Minifier"
const MSG_HTML_VALIDATOR = "HTML Validator"

const MSG_STEP_SUFFIX = ""
const msgStep = (msgSource, method) => (msg) => console.log((method ?? primary)(`${msgSource}${MSG_STEP_SUFFIX}${msg}`))

const msgStepEofol = msgStep(MSG_EOFOL)
const msgStepEofolSuccess = msgStep(MSG_EOFOL, success)
const msgStepParser = msgStep(MSG_HTML_PARSER)
const msgStepMinifier = msgStep(MSG_HTML_MINIFIER)
const msgStepValidator = msgStep(MSG_HTML_VALIDATOR)

// -------------------------------------------

const pushElement = (delta) => (rendered, index) => {
  delta.push({
    index,
    element: rendered,
  })
}

const transverseTree = (tree, vdom, instances, defs) => {
  const isContentNode = tree.type === undefined
  if (isContentNode) {
    return
  }

  const hasChildren =
    tree && tree.content && Array.isArray(tree.content) && tree.content.filter((x) => x.type !== undefined).length > 0
  const nextChildren = hasChildren ? [] : undefined

  let nextVdom
  if (tree.type === "eofol") {
    nextVdom = {
      type: "custom",
      name: getEofolComponentType(tree),
      children: nextChildren,
    }
  } else {
    nextVdom = {
      type: "tag",
      name: tree.type,
      children: nextChildren,
    }
  }

  vdom.push(nextVdom)

  if (hasChildren) {
    let delta = []
    const pushElementImpl = pushElement(delta)
    tree.content.forEach((child, index) => {
      if (isEofolCustomElement(child)) {
        validateEofolCustomElement(child)
        const rendered = renderEofolCustomElement(child, instances, defs)
        pushElementImpl(rendered, index)
        vdom[vdom.length - 1].id = rendered.attributes.id
      } else if (isEofolFlatElement(child)) {
        const rendered = renderEofolFlatElement(child, defs)
        pushElementImpl(rendered, index)
      } else if (isEofolStaticElement(child)) {
        const rendered = renderEofolStaticElement(child, defs)
        pushElementImpl(rendered, index)
      } else {
        return transverseTree(child, vdom[vdom.length - 1].children, instances, defs)
      }
    })
    delta.forEach((deltaElement) => {
      tree.content[deltaElement.index] = Array.isArray(deltaElement.element)
        ? deltaElement.element.reduce((acc, next) => acc + next, "")
        : deltaElement.element
    })
  }
  return tree
}

const compileStyle = (view, htmlPage) => {
  //breakpoints.forEach(({ name: mutation }) => {
  const mutation = "lg"
  const source = path.resolve(PATH_VIEWS_SRC, view, `${view}-${mutation}${EXT_CSS}`)

  if (fs.existsSync(source)) {
    const stylesContent = fs.readFileSync(source).toString()
    const htmlWithStyles = htmlPage
      .split("</style>")
      .map((htmlPart, i) => (i === 0 ? `${htmlPart} ${stylesContent}</style>` : htmlPart))
      .join("")
    return htmlWithStyles
  } else {
    return undefined
  }
  // })
}

// -------------------------------------------

msgStepEofol("Starting Eofol3 static compilation...")
if (isVerbose) {
  msgStepEofol(`Config = ${JSON.stringify(config, null, 2)}`)
}

const timeStart = new Date()

const views = fs.readdirSync(PATH_VIEWS_DIST)

views.forEach((view) => {
  const eofolDefsJS = require(path.resolve(PATH_VIEWS_DIST, view, view + EXT_JS))
  const eofolDefs = Object.keys(eofolDefsJS).map((eofolDefJS) => eofolDefsJS[eofolDefJS])

  const sources = fs
    .readdirSync(PATH_PUBLIC, { recursive: true })
    .filter((sourceFilename) => sourceFilename.endsWith(EXT_HTML))

  let i = 0

  const resultPromise = sources.map((source) => {
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

    return (
      minify(sourceHTML.toString(), minifyHTMLOptions)
        .then((res) => {
          return HTMLToJSON(res.toString(), false)
        })
        .then((res) => {
          if (isVerbose) {
            msgStepParser("Parse successful")
          }
          return res
        })
        .catch((ex) => {
          die("Parse error", ex)
        })
        .then((res) => {
          transverseTree(res, vdom, eofolInstances, eofolDefs)
          return res
        })
        .then((res) => {
          return JSONToHTML(res)
        })
        /*
      .then((res) => {
        return res
          .toString()
          .split("</head>")
          .map((part, i) => (i === 0 ? `${part}<style></style></head>` : part))
          .join("")
      })
      */
        .then((res) => {
          return compileStyle(view, res)
        })
        .then((res) => {
          return minify(res, minifyOptions)
        })
        .catch((ex) => {
          die("Minify error", ex)
        })
        .then((res) => {
          if (isVerbose) {
            msgStepMinifier("Minified successfully")
          }
          return res
        })
        .then((res) => {
          const options = {
            format: "text",
            data: res,
          }

          try {
            validator(options)
            if (isVerbose) {
              msgStepValidator("Valid HTML")
            }
          } catch (ex) {
            die("Invalid HTML", ex)
          }

          return res
        })
        .then((res) => {
          return HTML_DOCTYPE_TAG + res
        })
        .then((res) => {
          const targetPath = path.resolve(PATH_DERIVED, source)
          checkExistsCreate(PATH_DERIVED)
          const targetDir = removeFilePart(targetPath)
          checkExistsCreate(targetDir)
          fs.writeFileSync(targetPath, res)
          const internalDir = path.resolve(targetDir, DIRNAME_EOFOL_INTERNAL)
          checkExistsCreate(internalDir)
          writeInternal(vdom, eofolInstances, internalDir, path.parse(source).name)
          msgStepEofol(`[${i + 1}/${sources.length}] Compiled ${source} in ${prettyTime(new Date() - timeStart)}`)
          i += 1
        })
    )
  })

  Promise.all(resultPromise).then(() => {
    msgStepEofolSuccess(`Compiled successfully at ${PATH_DERIVED} in ${prettyTime(new Date() - timeStart)}.`)
  })
})
