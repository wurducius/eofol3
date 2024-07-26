// @IMPORT-START
import Html from "./html"
const { div } = Html
// @IMPORT("./html")
// @IMPORT-END

const skeleton = (msg?: string) => div(msg)

const spinner = () => div(undefined, "spinner")

const error = (msg?: string) => div(msg ?? "Error")

export default { skeleton, spinner, error }
