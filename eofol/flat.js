const {
  getEofolComponentType,
  findEofolComponentDef,
  getProps,
} = require("./core");
const { die } = require("../util/common");

const renderEofolFlatElement = (element, defs) => {
  const name = getEofolComponentType(element);
  const def = findEofolComponentDef(defs)(name);
  const props = getProps(element);

  if (!def) {
    die(
      `Cannot render custom eofol element: definition not found for component type: "${ 
        name 
        }"`,
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

module.exports = { renderEofolFlatElement };
