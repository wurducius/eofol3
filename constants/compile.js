const IMG_BASE_LOGO_WIDTH = 512;

const uglifyOptions = {
  parse: {},
  compress: false,
  mangle: true,
  output: {
    ast: true,
    //  code: false, // optional - faster if false
  },
};

module.exports = { IMG_BASE_LOGO_WIDTH, uglifyOptions };
