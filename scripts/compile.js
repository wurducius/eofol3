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

// -------------------------------------------

const EOFOL_CUSTOM_COMPONENT_TAGNAME = "eofol";
const EOFOL_CUSTOM_COMPONENT_ATTRIBUTE_TYPE = "name";

// -------------------------------------------

const getEofolComponentType = (element) =>
  element && element.attributes[EOFOL_CUSTOM_COMPONENT_ATTRIBUTE_TYPE];

const findEofolComponentDef = (name) =>
  eofolDefs.find(
    (componentDef) =>
      componentDef[EOFOL_CUSTOM_COMPONENT_ATTRIBUTE_TYPE] === name
  );

const isEofolCustomElement = (element) =>
  element && element.type === EOFOL_CUSTOM_COMPONENT_TAGNAME;

const validateEofolCustomElement = (element) => {
  if (Array.isArray(element.content) && element.content.length > 0) {
    die(
      `Eofol validation error: Custom eofol component cannot have children: Component ${getEofolComponentType(
        element
      )}`
    );
  }
};

const renderEofolCustomElement = (element) => {
  const name = getEofolComponentType(element);
  const def = findEofolComponentDef(name);

  if (!def) {
    msgStepEofol(
      'Cannot render custom eofol element: definition not found for component type: "' +
        name +
        '"'
    );
  }

  let id;
  if (element.attributes.id) {
    id = element.attributes.id;
  } else {
    id = generateId();
  }

  const as = element?.attributes?.as ?? "div";

  eofolInstances.push({
    name,
    id,
    state: def.initialState ? { ...def.initialState } : undefined,
    props: undefined,
    as,
  });

  return {
    type: as,
    content: [def.render()],
    attributes: {
      id,
    },
  };
};
/*
const eofolDefs = [
  {
    name: "component1",
    render: () => "COMPONENT 1",
    initialState: { data: 1 },
  },
  {
    name: "component2",
    render: () => "COMPONENT 2",
    initialState: { data: 2 },
  },
  { name: "component3", render: () => "COMPONENT 3" },
];
*/

const eofolInstances = [];

// -------------------------------------------

const die = (msg, ex) => {
  msgStepEofol(`Finished with error: ${msg}${ex ? `: ${ex.stack}` : ""}`);
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
  die("Clean error", ex);
}

const eofolDefsJS = require(path.resolve(PATH_CWD, "dist", "index.js"));
const eofolDefs = Object.keys(eofolDefsJS).map(
  (eofolDefJS) => eofolDefsJS[eofolDefJS]
);

const sources = fs
  .readdirSync(PATH_PUBLIC, { recursive: true })
  .filter((sourceFilename) => sourceFilename.endsWith(".html"));

const resultPromise = sources.map((source) => {
  let sourceHTML;
  try {
    const sourcePath = path.resolve(PATH_PUBLIC, source);
    if (!fs.existsSync(sourcePath)) {
      die(`Source file doesn't exist: ${sourcePath}`);
    }
    sourceHTML = fs.readFileSync(sourcePath);
  } catch (ex) {
    die(`Cannot open source file: ${sourcePath}`, ex);
  }

  return HTMLToJSON(sourceHTML.toString(), false)
    .then((res) => {
      msgStepParser("Parse successful");
      return res;
    })
    .catch((ex) => {
      die("Parse error", ex);
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
    .catch((ex) => {
      die("Minify error", ex);
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
        die("Invalid HTML", ex);
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
