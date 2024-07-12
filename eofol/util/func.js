const _pipe = (f, g) => (arg) => g(f(arg))
const pipe = (...fns) => fns.reduce(_pipe)

module.exports = { pipe }
