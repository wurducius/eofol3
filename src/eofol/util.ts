import { Func } from "./types"

// @IMPORT-START
import Constants from "./constants"
const { LOG_ERROR_MSG_PREFIX, ID_GENERATED_LENGTH } = Constants
// @IMPORT("./constants")
// @IMPORT-END

const generateString = (length: number) => () =>
  Array(length)
    .fill("")
    .map(() => Math.random().toString(36).charAt(2))
    .join("")

const generateId = generateString(ID_GENERATED_LENGTH)

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

export default {
  generateId,
  errorRuntime,
  pipe,
  id,
  errorInstanceNotFound,
  errorDefNotFound,
  errorElementNotFound,
  errorTypeUnknown,
  errorCustomCannotHaveChildren,
}
