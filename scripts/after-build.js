const fs = require("fs");

const {
  PATH_VIEWS_DIST,
  PATH_ASSETS_CSS,
  PATH_ASSETS_FONTS,
} = require("../constants/paths");
const { checkExistsCreate } = require("../util/fs");
const compileScript = require("../compiler/script");
const compileStyle = require("../compiler/style");
const copyPublicDir = require("../compiler/public");

const sourceViews = fs.readdirSync(PATH_VIEWS_DIST);

sourceViews.forEach((view, i) => compileScript(view));

fs.mkdirSync(PATH_ASSETS_CSS);
sourceViews.forEach((view, i) => compileStyle(view));

checkExistsCreate(PATH_ASSETS_FONTS);
copyPublicDir();
