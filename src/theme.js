const breakpoints = [
  { name: "sm", maxWidth: 720 },
  { name: "md", maxWidth: 1280 },
  { name: "lg", maxWidth: undefined },
]

const color = {
  primary: { base: "#26d9d9", dark: "#1b9898", light: "#67e4e4" },
  secondary: { base: "#673ab7", dark: "#46277c", light: "#916cd0" },
  bg: { base: "rgba(0, 0, 0, 0.725)", dark: "rgba(0, 0, 0, 0.575)", light: "rgba(0, 0, 0, 0.875)" },
  typography: "magenta",
  link: { base: "#40abc4", dark: "#418698", light: "#61bad0" },
}

const typography = {
  default: {
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 400,
    fontSize: "1rem",
    h1: { fontSize: "3rem" },
    h2: { fontSize: "2.25rem" },
    h3: { fontSize: "1.875rem" },
    h4: { fontSize: "1.5rem" },
    h5: { fontSize: "1.25rem" },
    h6: { fontSize: "1.125rem" },
    p: { fontSize: "1rem" },
  },
  link: {
    fontWeight: 700,
    fontSize: "1rem",
  },
}

const spacing = { container: { x: "32px", y: "32px" } }

const size = {}

const borderRadius = {}

const zIndex = {}

const config = {}

const theme = { breakpoints, color, typography, spacing, size, borderRadius, zIndex, config }

module.exports = theme
