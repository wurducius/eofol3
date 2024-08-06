const fs = require("fs")
const path = require("path")
const { EXT_JS, CODE_MODULE_EXPORTS } = require("../constants")

const CODE_EOFOL_IMPORT_OPENING = "// @IMPORT"

const VIEW_INJECT_EXPORTS = ["sx", "getCompileCache", "clearCompileCache", "getAssets"].join(", ")

const cleanExport = (scriptStr) => scriptStr.split("export default {")[0].split(CODE_MODULE_EXPORTS)[0]

const fixExportsFinal = (scriptStr) => {
  const split = scriptStr
    .toString()
    .replaceAll("export ", "")
    .replaceAll("default ", "module.exports = ")
    .split("module.exports = {")
  return split
    .map((part, i) => (i + 1 === split.length ? `${VIEW_INJECT_EXPORTS  },${  part}` : part))
    .join("module.exports = {")
}

const fixExports = (scriptStr) =>
  scriptStr.toString().replaceAll("export ", "").replaceAll("default ", "module.exports = ")

const resolveImports = (sourcePath, content, importedScripts) => {
  return content
    .toString()
    .split(`${CODE_EOFOL_IMPORT_OPENING}-`)
    .map((y) => {
      const yy = y.replaceAll("END", "")

      if (yy.includes(CODE_EOFOL_IMPORT_OPENING)) {
        const z = yy.split(`${CODE_EOFOL_IMPORT_OPENING}(`)
        return z.reduce((acc, next, innerIndex) => {
          if (innerIndex === 0) {
            return ""
          } else {
            const scriptPathRaw = next.replaceAll('"', "").replaceAll(")", "").trim()
            const scriptPath = path.resolve(sourcePath, scriptPathRaw + EXT_JS)
            if (importedScripts.includes(scriptPath)) {
              return acc
            } else {
              const script = fs.readFileSync(scriptPath).toString()
              const hasNext = script.includes("@IMPORT")
              importedScripts.push(scriptPath)
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

const precompile = (source, suffixPath, target, isView) => {
  const content = fs.readFileSync(source)
  const exportsReplaced = fixExports(content)
  const importedScripts = []
  const importsResolved = resolveImports(path.resolve(source, suffixPath), exportsReplaced, importedScripts)
  fs.writeFileSync(
    target,
    `let _internals = {}\n${isView ? fixExportsFinal(importsResolved) : fixExports(importsResolved)}`,
  )
}

module.exports = precompile
