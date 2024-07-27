const fs = require("fs")
const path = require("path")
const { EXT_JS, CODE_MODULE_EXPORTS, PATH_CWD } = require("../constants")

const CODE_EOFOL_IMPORT_OPENING = "// @IMPORT"

const cleanExport = (scriptStr) => scriptStr.split("export default {")[0].split(CODE_MODULE_EXPORTS)[0]

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
              if (scriptPathRaw.startsWith(".")) {
                // local file
                const script = fs.readFileSync(scriptPath).toString()

                const hasNext = script.includes("@IMPORT")
                importedScripts.push(scriptPath)
                const resolvedTreeScript = hasNext
                  ? resolveImports(path.resolve(scriptPath, ".."), cleanExport(script), importedScripts)
                  : script
                return acc + cleanExport(resolvedTreeScript.toString())
              } else {
                // external dependency
                const script = fs
                  .readFileSync(path.resolve(PATH_CWD, "node_modules", scriptPathRaw, "dist", `index${EXT_JS}`))
                  .toString()

                const filteredScript = script
                  .split("\n")
                  .filter((x) => !x.startsWith("exports."))
                  .filter((x) => !x.startsWith('Object.defineProperty(exports, "__esModule",'))
                  .join("\n")

                importedScripts.push(scriptPath)

                const resolved = filteredScript
                  .split('require("')
                  .map((part, i) => {
                    if (i > 0) {
                      return part
                        .split('")')
                        .map((partx, j) => {
                          if (j === 0) {
                            return fs
                              .readFileSync(
                                path.resolve(PATH_CWD, "node_modules", scriptPathRaw, "dist", `${partx}${EXT_JS}`),
                              )
                              .toString()
                          } else {
                            return partx
                          }
                        })
                        .join("")
                    } else {
                      return part
                    }
                  })
                  .join("")

                return acc + resolved
              }
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
  fs.writeFileSync(target, `let _internals = {}\n${fixExports(importsResolved)}`)
}

module.exports = precompile
