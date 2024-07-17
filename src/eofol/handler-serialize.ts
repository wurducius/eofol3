// @IMPORT-START
import Util from "./util"
const { pipe } = Util
// @IMPORT("./util")
// @IMPORT-END

const serializeJS = (handler: () => void) => `(${handler})()`

const pushVal = (val: string, name: string) => (handler: (() => void) | string) => `var ${name} = ${val}; ${handler}`

const handler = (props: any, state: any, setState: any, handler: any) =>
  pipe(
    pushVal(JSON.stringify(props), "props"),
    pushVal(setState, "setState"),
    pushVal(JSON.stringify(state), "state"),
  )(serializeJS(handler))

export default { handler }
