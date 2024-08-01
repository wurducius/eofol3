const https = require("https")
const { primary, success, error, prettyTime } = require("../eofol/dev-util")

const baseUrl = "https://eofol.com/eofol3/"

const items = [
  { url: `${baseUrl}index.html`, check: "<title>Eofol3 app - First page</title>" },
  { url: `${baseUrl}indexx.html`, check: "<title>Eofol3 app - Second page</title>" },
  { url: `${baseUrl}license.html`, check: "The MIT License (MIT)" },
  { url: `${baseUrl}asfaasd`, check: "Page not found" },
  { url: `${baseUrl}assets/js/index.js`, check: "instances" },
  { url: `${baseUrl}assets/media/fonts/Roboto-Regular.ttf`, size: 166512 },
  { url: `${baseUrl}assets/media/images/logo-lg.png`, size: 3810 },
]

const WAIT_INTERVAL_MS = 2000

const log = console.log
const logNewline = () => log("")
const logInfo = (msg) => log(primary(msg))
const logError = (msg) => log(error(msg))
const logSuccess = (msg) => log(success(msg))

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const results = items.map(() => undefined)

const errors = {}

const finish = (i, result, start, errorMsg) => {
  results[i] = result
  errors[i] = errorMsg
  if (results.filter((x) => x !== undefined).length === items.length) {
    logNewline()
    logInfo(`Test took ${prettyTime(new Date() - start)}.`)
    logNewline()
    if (results.filter(Boolean).length === items.length) {
      logSuccess(`SMOKE TEST PASSED: ${baseUrl}`)
    } else {
      logError("SMOKE TEST FAILED")
      results.forEach((failedResult, j) => {
        if (!failedResult) {
          logError(`FAILED ${items[j].url} -> ${errors[j]}`)
        }
      })
    }
  }
}

const data = {}

const get = (item, index, length, start) => {
  https
    .get(item.url, (resp) => {
      data[index] = ""

      resp.on("data", (chunk) => {
        data[index] += chunk
      })

      resp.on("end", () => {
        const itemData = data[index]
        const exists = itemData.length > 0
        const isChecked = !item.check || itemData.includes(item.check)
        const isSize = !item.size || itemData.length === item.size
        const passed = exists && isChecked && isSize
        const msg = `[${index + 1}/${length}] ${item.url} -> ${passed ? "OK" : "FAIL"}`
        let errorMsg = undefined
        if (passed) {
          logInfo(msg)
        } else {
          logError(msg)
          errorMsg = [
            !exists && "File does not exist.",
            !isChecked && `Invalid file content check, does not contain substring: "${item.check}".`,
            !isSize && `Invalid file size: expected = ${item.size} but actual = ${itemData.length}.`,
          ]
            .filter(Boolean)
            .join(" ")
        }
        finish(index, passed, start, errorMsg)
      })
    })

    .on("error", (err) => {
      logError(`Error: ${err.message}`)
    })
}

delay(WAIT_INTERVAL_MS).then(() => {
  const start = new Date()
  items.forEach((item, i) => {
    get(item, i, items.length, start)
  })
})
