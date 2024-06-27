const fs = require("fs");
const path = require("path");
const UUID = require("uuid");
const { v4: uuid } = UUID;

const { HTMLToJSON, JSONToHTML } = require("html-to-json-parser");
const { minify } = require("html-minifier-terser");
const validator = require("html-validator");

const { prettyTime } = require("@eofol/eofol-dev-utils");

// -------------------------------------------

const ARG_MINIFY = false;

// -------------------------------------------

const minifyOptions = {
  continueOnParseError: true,
  removeRedundantAttributes: true,
  removeComments: ARG_MINIFY,
  collapseWhitespace: ARG_MINIFY,
  minifyCSS: ARG_MINIFY,
  minifyJS: ARG_MINIFY,
};

const HTML_DOCTYPE_TAG = `<!DOCTYPE html>${ARG_MINIFY ? "" : "\n"}`;

const FILENAME_PUBLIC = "public";
const FILENAME_DERIVED = "derived";

const PATH_CWD = fs.realpathSync(process.cwd());
const PATH_DERIVED = path.resolve(PATH_CWD, FILENAME_DERIVED);
const PATH_PUBLIC = path.resolve(PATH_CWD, FILENAME_PUBLIC);

const EOFOL_CUSTOM_COMPONENT_TAGNAME = "eofol";

const MSG_EOFOL = "Eofol3";
const MSG_HTML_PARSER = "HTML Parser";
const MSG_HTML_MINIFIER = "HTML Minifier";
const MSG_HTML_VALIDATOR = "HTML Validator";

const MSG_STEP_SUFFIX = ": ";
const msgStep = (msgSource) => (msg) =>
  console.log(`${msgSource}${MSG_STEP_SUFFIX}${msg}`);

const msgStepEofol = msgStep(MSG_EOFOL);
const msgStepParser = msgStep(MSG_HTML_PARSER);
const msgStepMinifier = msgStep(MSG_HTML_MINIFIER);
const msgStepValidator = msgStep(MSG_HTML_VALIDATOR);

const EOFOL_VDOM_ROOT = "root";
const EOFOL_VDOM_TAG = "tag";
const EOFOL_VDOM_CUSTOM = "custom";

const EOFOL_INITIALVDOM = { type: EOFOL_VDOM_ROOT, children: [{}] };

// -------------------------------------------

const isEofolCustomElement = (element) =>
  element && element.type === EOFOL_CUSTOM_COMPONENT_TAGNAME;

const validateEofolCustomElement = (element) => {
  if (Array.isArray(element.content) && element.content.length > 0) {
    console.log("ERROR: CUSTOM EOFOL COMPONENT HAS CHILDREN");
    die();
  }
};

const renderEofolCustomElement = (element) => {
  const name = element.attributes.name;
  return {
    type: "div",
    content: [`EOFOL3 CUSTOM COMPONENT - TYPE ${name}`],
    attributes: {
      id: generateId(),
    },
  };
};

// -------------------------------------------

const die = () => {
  msgStepEofol("Finished with error.");
  process.exit(1);
};

const generateId = () => uuid();

const checkExistsCreate = (pathToCheck) => {
  if (!fs.existsSync(pathToCheck)) {
    fs.mkdirSync(pathToCheck, { recursive: true });
  }
};

const removeFilePart = (dirname) => path.parse(dirname).dir;

const transverseTree = (tree) => {
  // console.log(tree);
  if (tree && tree.content && Array.isArray(tree.content)) {
    let delta = [];
    tree.content.forEach((child, index) => {
      if (isEofolCustomElement(child)) {
        validateEofolCustomElement(child);
        delta.push({
          index,
          element: renderEofolCustomElement(child),
        });
      } else {
        return transverseTree(child);
      }
    });
    delta.forEach((deltaElement) => {
      tree.content[deltaElement.index] = deltaElement.element;
    });
  }
  return tree;
};

// -------------------------------------------

msgStepEofol("Compile");
msgStepEofol(`Minify = ${ARG_MINIFY}`);

const timeStart = new Date();

try {
  checkExistsCreate(PATH_DERIVED);
  fs.readdirSync(PATH_DERIVED).forEach((prevContent) => {
    fs.rmSync(path.resolve(PATH_DERIVED, prevContent), { recursive: true });
  });
} catch (ex) {
  msgStepEofol("Clean error");
  die();
}

const sources = fs
  .readdirSync(PATH_PUBLIC, { recursive: true })
  .filter((sourceFilename) => sourceFilename.endsWith(".html"));

const resultPromise = sources.map((source) => {
  let sourceHTML;
  try {
    const sourcePath = path.resolve(PATH_PUBLIC, source);
    if (!fs.existsSync(sourcePath)) {
      msgStepParser(`Source file doesn't exist: ${sourcePath}`);
      die();
    }
    sourceHTML = fs.readFileSync(sourcePath);
  } catch (ex) {
    msgStepParser(`Cannot open source file: ${sourcePath}`);
    die();
  }

  return HTMLToJSON(sourceHTML.toString(), false)
    .then((res) => {
      msgStepParser("Parse successful");
      return res;
    })
    .catch((res) => {
      msgStepParser("Parse error");
      die();
    })
    .then((res) => {
      transverseTree(res);
      return res;
    })
    .then((res) => {
      return JSONToHTML(res);
    })
    .then((res) => {
      return minify(res, minifyOptions);
    })
    .catch((res) => {
      msgStepMinifier("Minify error");
      die();
    })
    .then((res) => {
      msgStepMinifier("Minified successfully");
      return res;
    })
    .then((res) => {
      const options = {
        url: "http://url-to-validate.com",
        format: "text",
        data: res,
      };

      try {
        validator(options);
        msgStepValidator("Valid HTML");
      } catch (ex) {
        msgStepValidator("Invalid HTML");
        die();
      }

      return res;
    })
    .then((res) => {
      return HTML_DOCTYPE_TAG + res;
    })
    .then((res) => {
      const targetPath = path.resolve(PATH_DERIVED, source);
      checkExistsCreate(PATH_DERIVED);
      checkExistsCreate(removeFilePart(targetPath));
      fs.writeFileSync(targetPath, res);
      msgStepEofol(`Compiled ${source}`);
    });
});

Promise.all(resultPromise).then(() => {
  msgStepEofol("Compilation success!");
  msgStepEofol(`Took ${prettyTime(new Date() - timeStart)}.`);
});
