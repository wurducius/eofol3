const generateString = (length: number) => () =>
  Array(length)
    .fill("")
    .map((v) => Math.random().toString(36).charAt(2))
    .join("")
const generateId = generateString(17)

const EOFOL_ERROR_MSG_PREFIX = "EOFOL ERROR - "

const errorRuntime = (msg: string) => {
  console.log(`${EOFOL_ERROR_MSG_PREFIX}${msg}`)
}

export default { generateId, errorRuntime }
