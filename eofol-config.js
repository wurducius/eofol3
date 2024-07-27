const breakpoints = [
  {
    name: "sm",
    maxWidth: 720,
    imgWidth: 767,
    logoWidth: 192,
    png: {
      compression: 9,
    },
    jpg: { compression: 25 },
  },
  {
    name: "md",
    maxWidth: 1280,
    imgWidth: 1287,
    logoWidth: 320,
    png: {
      compression: 9,
    },
    jpg: { compression: 25 },
  },
  {
    name: "lg",
    maxWidth: undefined,
    imgWidth: 1800,
    logoWidth: 512,
    png: {
      compression: 9,
    },
    jpg: { compression: 25 },
  },
]

module.exports = { breakpoints }
