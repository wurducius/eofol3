const {
  getEofolComponentType,
  findEofolComponentDef,
  getProps,
} = require("./core");
const { generateId, die } = require("../util/common");

const renderEofolCustomElement = (element, instances, defs) => {
  const name = getEofolComponentType(element);
  const def = findEofolComponentDef(defs)(name);
  const props = getProps(element);

  if (!def) {
    die(
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
    props,
    as,
  });

  return {
    type: as,
    content: [def.render(undefined, undefined, props)],
    attributes: {
      id,
    },
  };
};

module.exports = { renderEofolCustomElement };
