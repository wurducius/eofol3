const ENV = require("./env")

const { MODE, BROWSER, HTTPS, HOST, PORT, SHOW_PROGRESS, ANALYZE_BUNDLE, GENERATE_SOURCEMAP, BASE_URL } = ENV

const isDev = MODE === "development"

const isHttps = HTTPS === true
const protocol = isHttps ? "https" : "http"

const getBrowser = (property) => {
  if (property === "false" || property === false) {
    return false
  } else if (property === "true" || property === true) {
    return true
  } else {
    return {
      app: {
        name: BROWSER,
      },
    }
  }
}

module.exports = {
  ...ENV,
  MODE: isDev ? "development" : "production",
  BROWSER: getBrowser(BROWSER),
  HTTPS: protocol,
  PROTOCOL: protocol,
  SHOW_PROGRESS: SHOW_PROGRESS === true,
  ANALYZE_BUNDLE: ANALYZE_BUNDLE === true,
  GENERATE_SOURCEMAP: GENERATE_SOURCEMAP === true,
  SERVE_URL: `${protocol}://${HOST}:${PORT}`,
  MINIMIZE: !isDev,
  TERSER: !isDev,
  CSS_MINIMIZE: !isDev,
  BASE_URL: isDev ? "/" : BASE_URL,
}
