// @IMPORT-START
import Util from "./util"
const { pipe } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import Constants from "./constants"
const { HANDLER_SERIALIZED_PROPS, HANDLER_SERIALIZED_STATE, HANDLER_SERIALIZED_SETSTATE } = Constants
// @IMPORT("./constants")
// @IMPORT-END

const serializeJS = (handler: () => void) => `(${handler})()`

const pushVal = (val: string, name: string) => (handler: (() => void) | string) => `var ${name} = ${val}; ${handler}`

const handler = (props: any, state: any, setState: any, handler: any) =>
  pipe(
    pushVal(JSON.stringify(props), HANDLER_SERIALIZED_PROPS),
    pushVal(JSON.stringify(state), HANDLER_SERIALIZED_STATE),
    pushVal(setState, HANDLER_SERIALIZED_SETSTATE),
  )(serializeJS(handler))

const handlerProps = (props: any, handler: any) =>
  pushVal(JSON.stringify(props), HANDLER_SERIALIZED_PROPS)(serializeJS(handler))

const handlerSimple = (handler: any) => serializeJS(handler)

export default { handler, handlerProps, handlerSimple }
