const fs = require("fs");
const path = require("path");
const { PATH_VIEWS_SRC, PATH_ASSETS_CSS } = require("../constants/paths");
const { EXT_CSS } = require("../constants/common");
const { breakpoints } = require("../eofol-config");

const compileStyle = (view) => {
  breakpoints.forEach(({ name: mutation }) => {
    const source = path.resolve(
      PATH_VIEWS_SRC,
      view,
      `${view}-${mutation}${EXT_CSS}`,
    );
    const target = path.resolve(
      PATH_ASSETS_CSS,
      `${view}-${mutation}${EXT_CSS}`,
    );

    if (fs.existsSync(source)) {
      const styleContent = fs.readFileSync(source);
      fs.writeFileSync(target, styleContent.toString());
    }
  });
};

module.exports = compileStyle;
