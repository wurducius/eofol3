const die = (msg, ex) => {
  console.log(`Finished with error: ${msg}${ex ? `: ${ex.stack}` : ""}`)
  process.exit(1)
}

module.exports = { die }
