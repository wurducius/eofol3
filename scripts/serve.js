const fs = require("fs")
const { spawn, primary, error } = require("../eofol/dev-util")
const { BUILD_PATH } = require("../config/paths")
const { PORT } = require("../config/env")

const SERVE_CACHE_TTL_MS = 31536000000

console.log(primary("Serving build folder..."))

const args = process.argv.slice(2)

if (fs.existsSync(BUILD_PATH)) {
  const result = spawn.sync(
    "http-server",
    ["./build", "-p", PORT, "-a", "0.0.0.0", "-g", "-c", SERVE_CACHE_TTL_MS, "--cors", "-o", ...args],
    {
      stdio: "inherit",
    },
  )

  process.exit(result.status)
} else {
  console.log(error("Build folder not found. Please run 'npm run build' first."))
}
