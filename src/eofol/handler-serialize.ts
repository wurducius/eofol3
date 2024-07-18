import { Handler, Props, SetState, State } from "./types"

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

const serializeJS = (handler: Handler) => `(${handler.toString()})()`

const pushVal = (val: string, name: string) => (handler: (() => void) | string) => `var ${name} = ${val}; ${handler}`

const pushProps = (props: Props) => pushVal(JSON.stringify(props), HANDLER_SERIALIZED_PROPS)

const handler = (props: Props, state: State, setState: SetState, handler: Handler) =>
  pipe(
    pushProps(props),
    pushVal(JSON.stringify(state), HANDLER_SERIALIZED_STATE),
    pushVal(setState.toString(), HANDLER_SERIALIZED_SETSTATE),
  )(serializeJS(handler))

const handlerProps = (props: Props, handler: Handler) => pushProps(props)(serializeJS(handler))

const handlerSimple = (handler: Handler) => serializeJS(handler)

export default { handler, handlerProps, handlerSimple }
