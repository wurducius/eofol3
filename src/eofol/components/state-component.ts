// @IMPORT-START
import Html from "../ui/html"
const { div } = Html
// @IMPORT("../ui/html")
// @IMPORT-END

const skeleton = (msg?: string) => div(msg)

const spinner = () => div(undefined, "spinner")

const error = (msg?: string) => div(msg ?? "Error")

export default { skeleton, spinner, error }
