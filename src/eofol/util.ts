import { Func } from "./types"

// @IMPORT-START
import Contansts from "./constants"
const { LOG_ERROR_MSG_PREFIX, ID_GENERATED_LENGTH } = Contansts
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

const _pipe = (f: Func, g: Func) => (arg: any) => g(f(arg))
const pipe = (...fns: Func[]) => fns.reduce(_pipe)

const id = (x: any) => x

export default { generateId, errorRuntime, pipe, id }
