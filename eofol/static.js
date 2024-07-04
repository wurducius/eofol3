const { getEofolComponentType, findEofolComponentDef } = require("./core");
const { die } = require("../util/common");

const renderEofolStaticElement = (element, defs) => {
  const name = getEofolComponentType(element);
  const def = findEofolComponentDef(defs)(name);

  if (!def) {
    die(
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

module.exports = { renderEofolStaticElement };
