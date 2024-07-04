const { die } = require("../util/common");
const EOFOL_CUSTOM_COMPONENT_TAGNAME = "custom";
const EOFOL_FLAT_COMPONENT_TAGNAME = "flat";
const EOFOL_STATIC_COMPONENT_TAGNAME = "static";

const EOFOL_COMPONENT_ATTRIBUTE_TYPE = "name";

// -------------------------------------------

const getEofolComponentType = (element) =>
  element && element.attributes[EOFOL_COMPONENT_ATTRIBUTE_TYPE];

const findEofolComponentDef = (defs) => (name) =>
  defs.find(
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

const notProps = ["name", "as"];

const getProps = (element) => {
  const props = structuredClone(element.attributes);
  Object.keys(props)
    .filter((key) => notProps.includes(key))
    .forEach((key) => delete props[key]);
  return props;
};

module.exports = {
  getEofolComponentType,
  findEofolComponentDef,
  EOFOL_COMPONENT_ATTRIBUTE_TYPE,
  isEofolStaticElement,
  isEofolCustomElement,
  isEofolFlatElement,
  validateEofolCustomElement,
  getProps,
};
