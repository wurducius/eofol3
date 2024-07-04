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

const { config, isVerbose, minifyOptions } = require("../constants/compile");
const {
  PATH_DERIVED,
  PATH_PUBLIC,
  PATH_EOFOL_INTERNAL,
  PATH_VIEWS_DIST,
  FILENAME_SUFFIX_VDOM,
  FILENAME_SUFFIX_INSTANCES,
  DIRNAME_EOFOL_INTERNAL,
} = require("../constants/paths");
const { EXT_HTML } = require("../constants/common");

const HTML_DOCTYPE_TAG = `<!DOCTYPE html>${config.minifyHTML ? "" : "\n"}`;

const MSG_EOFOL = "";
const MSG_HTML_PARSER = "HTML Parser";
const MSG_HTML_MINIFIER = "HTML Minifier";
const MSG_HTML_VALIDATOR = "HTML Validator";

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

// -------------------------------------------

const getEofolComponentType = (element) =>
  element && element.attributes[EOFOL_COMPONENT_ATTRIBUTE_TYPE];

const findEofolComponentDef = (name) =>
  eofolDefs.find(
    (componentDef) => componentDef[EOFOL_COMPONENT_ATTRIBUTE_TYPE] === name,
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
        element,
      )}`,
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
        '"',
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

const notProps = ["name", "as"];

const getProps = (element) => {
  const props = structuredClone(element.attributes);
  Object.keys(props)
    .filter((key) => notProps.includes(key))
    .forEach((key) => delete props[key]);
  return props;
};

const renderEofolFlatElement = (element) => {
  const name = getEofolComponentType(element);
  const def = findEofolComponentDef(name);
  const props = getProps(element);

  if (!def) {
    msgStepEofol(
      'Cannot render custom eofol element: definition not found for component type: "' +
        name +
        '"',
    );
  }

  // @TODO
  const as = element?.attributes?.as ?? "h5";

  return {
    type: as,
    content: [def.render(props)],
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
        '"',
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
      } else if (isEofolStaticElement(child)) {
        const rendered = renderEofolStaticElement(child);
        pushElementImpl(rendered, index);
      } else {
        return transverseTree(child, vdom[vdom.length - 1].children, instances);
      }
    });
    delta.forEach((deltaElement) => {
      tree.content[deltaElement.index] = Array.isArray(deltaElement.element)
        ? deltaElement.element.reduce((acc, next) => acc + next, "")
        : deltaElement.element;
    });
  }
  return tree;
};

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
const eofolDefsJS = require(path.resolve(PATH_VIEWS_DIST, "index", "index.js"));
const eofolDefs = Object.keys(eofolDefsJS).map(
  (eofolDefJS) => eofolDefsJS[eofolDefJS],
);

const sources = fs
  .readdirSync(PATH_PUBLIC, { recursive: true })
  .filter((sourceFilename) => sourceFilename.endsWith(EXT_HTML));

let i = 0;

const resultPromise = sources.map((source) => {
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

  return minify(sourceHTML.toString(), { removeComments: true })
    .then((res) => {
      return HTMLToJSON(res.toString(), false);
    })
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
      const internalDir = path.resolve(targetDir, DIRNAME_EOFOL_INTERNAL);
      checkExistsCreate(internalDir);
      const viewName = path.parse(source).name;
      const targetVDOMFilename = `${viewName}${FILENAME_SUFFIX_VDOM}`;
      const targetVDOMPath = path.resolve(internalDir, targetVDOMFilename);
      fs.writeFileSync(
        targetVDOMPath,
        JSON.stringify(vdom[0], null, config.minifyRegistryJSON ? 0 : 2),
      );
      const targetInstancesFilename = `${viewName}${FILENAME_SUFFIX_INSTANCES}`;
      const targetInstancesPath = path.resolve(
        internalDir,
        targetInstancesFilename,
      );
      fs.writeFileSync(
        targetInstancesPath,
        JSON.stringify(eofolInstances, null, config.minifyRegistryJSON ? 0 : 2),
      );
      msgStepEofol(
        `[${i + 1}/${sources.length}] Compiled ${source} in ${prettyTime(
          new Date() - timeStart,
        )}`,
      );
      i += 1;
    });
});

Promise.all(resultPromise).then(() => {
  msgStepEofolSuccess(
    `Compiled successfully at ${PATH_DERIVED} in ${prettyTime(
      new Date() - timeStart,
    )}.`,
  );
});
