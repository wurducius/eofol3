const { primary } = require("../dev-util")

console.log(primary("Starting the development server..."))

/*

const {
  envImpl: { MODE, SERVE_URL },
} = require("../config")

 console.log(
   primary(`Serving eofol app ${appName} in ${MODE} mode at `) +
     success(SERVE_URL)
 );

;["SIGINT", "SIGTERM"].forEach(function (sig) {
  process.on(sig, stopServer)
})

*/
