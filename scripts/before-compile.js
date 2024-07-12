const fs = require("fs")
const path = require("path")

const { PATH_VIEWS_DIST, PATH_DIST, DIRNAME_EOFOL_INTERNAL, EXT_JS } = require("../constants")

const cleanExport = (scriptStr) => scriptStr.split("export default {")[0].split("module.exports")[0]

const fixExports = (scriptStr) =>
  scriptStr.toString().replaceAll("export ", "").replaceAll("default ", "module.exports = ")

const resolveImports = (sourcePath, content, importedScripts) => {
  return content
    .toString()
    .split("// @IMPORT-")
    .map((y, i) => {
      const yy = y.replaceAll("END", "")

      if (yy.includes("// @IMPORT")) {
        const z = yy.split("// @IMPORT(")
        return z.reduce((acc, next, innerIndex) => {
          if (innerIndex === 0) {
            return ""
          } else {
            const scriptPathRaw = next.replaceAll('"', "").replaceAll(")", "").trim()
            if (importedScripts.includes(scriptPathRaw)) {
              return acc
            } else {
              const scriptPath = path.resolve(sourcePath, scriptPathRaw + EXT_JS)
              const script = fs.readFileSync(scriptPath).toString()
              const hasNext = script.includes("@IMPORT")
              importedScripts.push(scriptPathRaw)
              const resolvedTreeScript = hasNext
                ? resolveImports(path.resolve(scriptPath, ".."), cleanExport(script), importedScripts)
                : script
              return acc + cleanExport(resolvedTreeScript.toString())
            }
          }
        }, "")
      } else {
        return fixExports(yy)
      }
    })
    .join("")
}

const precompile = (source, suffixPath) => {
  const content = fs.readFileSync(source)
  const exportsReplaced = fixExports(content)
  const importedScripts = []
  const importsResolved = resolveImports(path.resolve(source, suffixPath), exportsReplaced, importedScripts)
  fs.writeFileSync(source, fixExports(importsResolved))
}

// ---------------------------------------------
// 1. Transforms script from ES module into CommonJS
// 2. Resolves imports (so far only depth 1 file)
// ---------------------------------------------

fs.readdirSync(PATH_VIEWS_DIST).forEach((view) => {
  precompile(path.resolve(PATH_VIEWS_DIST, view, `${view}${EXT_JS}`), "..")
})

precompile(path.resolve(PATH_DIST, DIRNAME_EOFOL_INTERNAL, `core${EXT_JS}`), "..")
