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
  const stateImpl = def.initialState ? { ...def.initialState } : undefined;

  instances.push({
    name,
    id,
    state: stateImpl,
    props,
    as,
  });

  return {
    type: as,
    content: [
      def.render(
        stateImpl,
        (nextState) => {
          // @TODO Statically compiled setState
          const thisInstance = instances.find((instance) => instance.id === id);
          if (thisInstance) {
            thisInstance.state = nextState;
            forceRerender();
          } else {
            console.log(
              `EOFOL ERROR - Couldn't find component instance for name: ${name}.`,
            );
          }
        },
        props,
      ),
    ],
    attributes: {
      id,
    },
  };
};

module.exports = { renderEofolCustomElement };
