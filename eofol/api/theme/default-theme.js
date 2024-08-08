const breakpoints = [
  { name: "sm", maxWidth: 720 },
  { name: "md", maxWidth: 1280 },
  { name: "lg", maxWidth: undefined },
]

const color = {
  primary: { base: "#26d9d9", dark: "#1b9898", light: "#67e4e4" },
  secondary: { base: "#86B1FF", dark: "#5186F8", light: "#86B1FF" },
  bg: { base: "rgb(70, 70, 70)", dark: "rgba(32, 32, 32)", light: "rgba(108, 108, 108)" },
  form: { base: "rgb(51, 51, 51)" },
  typography: "magenta",
  link: { base: "#40abc4", dark: "#418698", light: "#61bad0" },
}

const typography = {
  default: {
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 400,
    fontSize: "20px",
    h1: { fontSize: "3em", fontWeight: 700 },
    h2: { fontSize: "2.25em", fontWeight: 700 },
    h3: { fontSize: "1.875em", fontWeight: 700 },
    h4: { fontSize: "1.5em", fontWeight: 700 },
    h5: { fontSize: "1.25em", fontWeight: 700 },
    h6: { fontSize: "1.125em", fontWeight: 700 },
    p: { fontSize: "1em", fontWeight: 400 },
  },
  link: {
    fontWeight: 700,
    fontSize: "1em",
  },
  button: {
    fontWeight: 500,
    fontSize: "1em",
  },
}

const spacing = { xs: "4px", sm: "8px", md: "16px", lg: "32px", xl: "64px", xxl: "128px" }

const size = {}

const borderRadius = { borderRadius: "8px" }

const zIndex = {}

const config = {}

const theme = { breakpoints, color, typography, spacing, size, borderRadius, zIndex, config }

module.exports = theme
