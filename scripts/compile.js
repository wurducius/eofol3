const fs = require("fs");
const path = require("path");
const UUID = require("uuid");
const { v4: uuid } = UUID;

const { HTMLToJSON, JSONToHTML } = require("html-to-json-parser");
const { minify } = require("html-minifier-terser");
const validator = require("html-validator");

const {
  prettyTime,
  primary,
  success,
  error,
} = require("@eofol/eofol-dev-utils");

// -------------------------------------------

const argsConfig = {
  minifyHTML: false,
  minifyRegistryJSON: false,
  verbose: false,
};
const defaultConfig = {
  production: false,
  minifyHTML: false,
  minifyRegistryJSON: false,
  verbose: false,
};
const config = { ...defaultConfig, ...argsConfig };
if (argsConfig.production) {
  config.minifyHTML = true;
  config.minifyRegistryJSON = true;
}
const isVerbose = config.verbose;

// -------------------------------------------

const minifyOptions = {
  continueOnParseError: true,
  removeRedundantAttributes: true,
  removeComments: config.minifyHTML,
  collapseWhitespace: config.minifyHTML,
  minifyCSS: config.minifyHTML,
  minifyJS: config.minifyHTML,
};

const HTML_DOCTYPE_TAG = `<!DOCTYPE html>${config.minifyHTML ? "" : "\n"}`;

const FILENAME_PUBLIC = "public";
const FILENAME_DERIVED = "derived";
const FILENAME_EOFOL_INTERNAL = "eofol";
const FILENAME_SUFFIX_VDOM = "vdom";
const FILENAME_SUFFIX_INSTANCES = "instances";

const PATH_CWD = fs.realpathSync(process.cwd());
const PATH_DERIVED = path.resolve(PATH_CWD, FILENAME_DERIVED);
const PATH_PUBLIC = path.resolve(PATH_CWD, FILENAME_PUBLIC);

// const MSG_EOFOL = "Eofol3";
const MSG_EOFOL = "";
const MSG_HTML_PARSER = "HTML Parser";
const MSG_HTML_MINIFIER = "HTML Minifier";
const MSG_HTML_VALIDATOR = "HTML Validator";

// const MSG_STEP_SUFFIX = ": ";
const MSG_STEP_SUFFIX = "";
const msgStep = (msgSource, method) => (msg) =>
  console.log((method ?? primary)(`${msgSource}${MSG_STEP_SUFFIX}${msg}`));

const msgStepEofol = msgStep(MSG_EOFOL);
const msgStepEofolError = msgStep(MSG_EOFOL, error);
const msgStepEofolSuccess = msgStep(MSG_EOFOL, success);
const msgStepParser = msgStep(MSG_HTML_PARSER);
const msgStepMinifier = msgStep(MSG_HTML_MINIFIER);
const msgStepValidator = msgStep(MSG_HTML_VALIDATOR);

// -------------------------------------------

const EOFOL_CUSTOM_COMPONENT_TAGNAME = "custom";
const EOFOL_FLAT_COMPONENT_TAGNAME = "flat";
const EOFOL_STATIC_COMPONENT_TAGNAME = "static";

const EOFOL_COMPONENT_ATTRIBUTE_TYPE = "name";
const EOFOL_COMPONENT_PROP_CUSTOM_PREFIX = "e-";

// -------------------------------------------

const getEofolComponentType = (element) =>
  element && element.attributes[EOFOL_COMPONENT_ATTRIBUTE_TYPE];

const findEofolComponentDef = (name) =>
  eofolDefs.find(
    (componentDef) => componentDef[EOFOL_COMPONENT_ATTRIBUTE_TYPE] === name
  );

const isEofolCustomElement = (element) =>
  element && element.type === EOFOL_CUSTOM_COMPONENT_TAGNAME;

const isEofolFlatElement = (element) =>
  element && element.type === EOFOL_FLAT_COMPONENT_TAGNAME;

const isEofolStaticElement = (element) =>
  element && element.type === EOFOL_STATIC_COMPONENT_TAGNAME;

const validateEofolCustomElement = (element) => {
  if (Array.isArray(element.content) && element.content.length > 0) {
    die(
      `Eofol validation error: Custom eofol component cannot have children: Component ${getEofolComponentType(
        element
      )}`
    );
  }
};

const renderEofolCustomElement = (element, instances) => {
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

  instances.push({
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

const renderEofolFlatElement = (element) => {
  const name = getEofolComponentType(element);
  const def = findEofolComponentDef(name);

  if (!def) {
    msgStepEofol(
      'Cannot render custom eofol element: definition not found for component type: "' +
        name +
        '"'
    );
  }

  // @TODO
  const as = element?.attributes?.as ?? "h5";

  return {
    type: as,
    content: [def.render()],
    attributes: {},
  };
};

const renderEofolStaticElement = (element) => {
  const name = getEofolComponentType(element);
  const def = findEofolComponentDef(name);

  if (!def) {
    msgStepEofol(
      'Cannot render custom eofol element: definition not found for component type: "' +
        name +
        '"'
    );
  }

  // @TODO
  // const as = element?.attributes?.as ?? "h5";

  const rendered = def.render();
  const reduced = Array.isArray(rendered) ? rendered.join("") : rendered;

  return {
    // @TODO
    //  type: "static",
    type: "div",
    content: [reduced],
    // attributes: {},
  };
};

// -------------------------------------------

const die = (msg, ex) => {
  msgStepEofolError(`Finished with error: ${msg}${ex ? `: ${ex.stack}` : ""}`);
  process.exit(1);
};

const generateId = () => uuid();

const checkExistsCreate = (pathToCheck) => {
  if (!fs.existsSync(pathToCheck)) {
    fs.mkdirSync(pathToCheck, { recursive: true });
  }
};

const removeFilePart = (dirname) => path.parse(dirname).dir;

const pushElement = (delta) => (rendered, index) => {
  delta.push({
    index,
    element: rendered,
  });
};

const transverseTree = (tree, vdom, instances) => {
  const isContentNode = tree.type === undefined;
  if (isContentNode) {
    return;
  }

  const hasChildren =
    tree &&
    tree.content &&
    Array.isArray(tree.content) &&
    tree.content.filter((x) => x.type !== undefined).length > 0;
  const nextChildren = hasChildren ? [] : undefined;

  let nextVdom;
  if (tree.type === "eofol") {
    nextVdom = {
      type: "custom",
      name: getEofolComponentType(tree),
      children: nextChildren,
    };
  } else {
    nextVdom = {
      type: "tag",
      name: tree.type,
      children: nextChildren,
    };
  }

  vdom.push(nextVdom);

  if (hasChildren) {
    let delta = [];
    const pushElementImpl = pushElement(delta);
    tree.content.forEach((child, index) => {
      if (isEofolCustomElement(child)) {
        validateEofolCustomElement(child);
        const rendered = renderEofolCustomElement(child, instances);
        pushElementImpl(rendered, index);
        vdom[vdom.length - 1].id = rendered.attributes.id;
      } else if (isEofolFlatElement(child)) {
        const rendered = renderEofolFlatElement(child);
        pushElementImpl(rendered, index);
        //  vdom[vdom.length - 1].id = rendered.attributes.id;
      } else if (isEofolStaticElement(child)) {
        const rendered = renderEofolStaticElement(child);
        pushElementImpl(rendered, index);
        //  vdom[vdom.length - 1].id = rendered.attributes.id;
      } else {
        return transverseTree(child, vdom[vdom.length - 1].children, instances);
      }
    });
    delta.forEach((deltaElement) => {
      const resultContent = Array.isArray(deltaElement.element)
        ? deltaElement.element.reduce((acc, next) => acc + next, "")
        : deltaElement.element;
      tree.content[deltaElement.index] = resultContent;
    });
  }
  return tree;
};

/*
const resolveStaticComponents = (tree) => {
  const isContentNode = tree.type === undefined;
  if (isContentNode) {
    return;
  }

  if (tree.type === "static") {
    return;
  } else {
    tree.content.forEach((child) => {
      return resolveStaticComponents(child);
    });
  }
};
*/

// -------------------------------------------

msgStepEofol("Starting Eofol3 static compilation...");
if (isVerbose) {
  msgStepEofol(`Config = ${JSON.stringify(config, null, 2)}`);
}

const timeStart = new Date();

try {
  checkExistsCreate(PATH_DERIVED);
  fs.readdirSync(PATH_DERIVED).forEach((prevContent) => {
    fs.rmSync(path.resolve(PATH_DERIVED, prevContent), { recursive: true });
  });
} catch (ex) {
  die("Clean error", ex);
}

// @TODO: HARDCODED filename index.js
const eofolDefsJS = require(path.resolve(
  PATH_CWD,
  "dist",
  "views",
  "index",
  "index.js"
));
const eofolDefs = Object.keys(eofolDefsJS).map(
  (eofolDefJS) => eofolDefsJS[eofolDefJS]
);

const sources = fs
  .readdirSync(PATH_PUBLIC, { recursive: true })
  .filter((sourceFilename) => sourceFilename.endsWith(".html"));

let i = 0;

const resultPromise = sources.map((source) => {
  const timeStartSource = new Date();

  const eofolInstances = [];
  const vdom = [];

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
      if (isVerbose) {
        msgStepParser("Parse successful");
      }
      return res;
    })
    .catch((ex) => {
      die("Parse error", ex);
    })
    .then((res) => {
      transverseTree(res, vdom, eofolInstances);
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
      if (isVerbose) {
        msgStepMinifier("Minified successfully");
      }
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
        if (isVerbose) {
          msgStepValidator("Valid HTML");
        }
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
      const targetDir = removeFilePart(targetPath);
      checkExistsCreate(targetDir);
      fs.writeFileSync(targetPath, res);
      const internalDirPath = path.resolve(targetDir, FILENAME_EOFOL_INTERNAL);
      checkExistsCreate(internalDirPath);
      const targetVDOMFilename = `${
        path.parse(source).name
      }-${FILENAME_SUFFIX_VDOM}.json`;
      const targetVDOMPath = path.resolve(internalDirPath, targetVDOMFilename);
      fs.writeFileSync(
        targetVDOMPath,
        JSON.stringify(vdom[0], null, config.minifyRegistryJSON ? 0 : 2)
      );
      const targetInstancesFilename = `${
        path.parse(source).name
      }-${FILENAME_SUFFIX_INSTANCES}.json`;
      const targetInstancesPath = path.resolve(
        internalDirPath,
        targetInstancesFilename
      );
      fs.writeFileSync(
        targetInstancesPath,
        JSON.stringify(eofolInstances, null, config.minifyRegistryJSON ? 0 : 2)
      );
      msgStepEofol(
        `[${i + 1}/${sources.length}] Compiled ${source} in ${prettyTime(
          new Date() - timeStart
        )}`
      );
      i += 1;
    });
});

Promise.all(resultPromise).then(() => {
  msgStepEofolSuccess(
    `Compiled successfully at ${PATH_DERIVED} in ${prettyTime(
      new Date() - timeStart
    )}.`
  );
});
