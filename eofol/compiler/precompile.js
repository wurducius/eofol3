const fs = require("fs")
const path = require("path")
const { EXT_JS } = require("../constants")

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

const precompile = (source, suffixPath, target) => {
  const content = fs.readFileSync(source)
  const exportsReplaced = fixExports(content)
  const importedScripts = []
  const importsResolved = resolveImports(path.resolve(source, suffixPath), exportsReplaced, importedScripts)
  fs.writeFileSync(target, fixExports(importsResolved))
}

module.exports = precompile
