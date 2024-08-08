const IMG_BASE_LOGO_WIDTH = 512

const uglifyOptions = {
  parse: {},
  compress: true,
  mangle: true,
  output: {
    // ast: false,
    //  code: false, // optional - faster if false
    semicolons: false,
  },
}

const babelOptions = {}
// presets: ["@babel/preset-env"]

const COMPRESS_GZIP_BUILD_FILES = false
const COMPRESS_GZIP_LEVEL = 9

module.exports = { IMG_BASE_LOGO_WIDTH, uglifyOptions, babelOptions, COMPRESS_GZIP_BUILD_FILES, COMPRESS_GZIP_LEVEL }
