import { Attributes, Func } from "./types"

// @IMPORT-START
import Constants from "./constants"
const { LOG_ERROR_MSG_PREFIX } = Constants
// @IMPORT("./constants")
// @IMPORT-END

const errorRuntime = (msg: string) => {
  console.log(`${LOG_ERROR_MSG_PREFIX}${msg}`)
}

const errorInstanceNotFound = (id: string) => {
  errorRuntime(`Couldn't find component instance for id: ${id}.`)
}

const errorDefNotFound = (name: string) => {
  errorRuntime(`Couldn't find def for name: ${name}.`)
}

const errorElementNotFound = (id: string, name: string) => {
  errorRuntime(`Couldn't select DOM element with id: ${id} and name: ${name}.`)
}

const errorTypeUnknown = (type: string) => {
  errorRuntime(`Unknown Eofol component type: ${type}.`)
}

const errorValidation = (type: string, msg: string) => {
  errorRuntime(`Eofol validation error: ${msg} Component type:${type}.`)
}

const errorCustomCannotHaveChildren = (type: string) => {
  errorValidation(type, "Custom Eofol component cannot have children.")
}

const _pipe = (f: Func, g: Func) => (arg: any) => g(f(arg))
const pipe = (...fns: Func[]) => fns.reduce(_pipe)

const id = (x: any) => x

// eslint-disable-next-line no-unused-vars
function arrayCombinator<T>(handler: (t: T) => any) {
  return function (value: T | T[] | undefined) {
    if (value === undefined) {
      return undefined
    } else if (Array.isArray(value)) {
      return value.map(handler)
    } else {
      return handler(value)
    }
  }
}

export default {
  errorRuntime,
  pipe,
  id,
  errorInstanceNotFound,
  errorDefNotFound,
  errorElementNotFound,
  errorTypeUnknown,
  errorCustomCannotHaveChildren,
  arrayCombinator,
}
