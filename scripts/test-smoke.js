const https = require("https")

const baseUrl = "https://eofol.com/eofol3/"

const items = [
  { url: `${baseUrl}index.html`, check: "<title>Eofol3 app - First page</title>" },
  { url: `${baseUrl}indexx.html`, check: "<title>Eofol3 app - Second page</title>" },
  { url: `${baseUrl}license.html`, check: "The MIT License (MIT)" },
  { url: `${baseUrl}asfaasd`, check: "Page not found" },
  { url: `${baseUrl}assets/js/index.js` },
  { url: `${baseUrl}assets/media/fonts/Roboto-Regular.ttf` },
  { url: `${baseUrl}assets/media/images/logo-lg.png` },
]

const results = items.map(() => undefined)

const finish = (i, result) => {
  results[i] = result
  if (results.filter((x) => x !== undefined).length === items.length) {
    console.log("")
    if (results.filter(Boolean).length === items.length) {
      console.log("SMOKE TEST PASSED")
    } else {
      console.log("SMOKE TEST FAILED")
      results.forEach((failedResult, j) => {
        if (!failedResult) {
          console.log(`FAILED -> ${items[j].url}`)
        }
      })
    }
  }
}

const get = (item, index, length) => {
  https
    .get(item.url, (resp) => {
      let data = ""

      resp.on("data", (chunk) => {
        data += chunk
      })

      resp.on("end", () => {
        const passed = data.length > 0 && (!item.check || data.includes(item.check))
        console.log(`[${index + 1}/${length}] ${item.url} -> ${passed ? "OK" : "FAIL"}`)
        finish(index, passed)
      })
    })

    .on("error", (err) => {
      console.log(`Error: ${err.message}`)
    })
}

items.forEach((item, i) => {
  get(item, i, items.length)
})
