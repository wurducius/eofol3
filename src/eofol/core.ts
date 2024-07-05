type VDOMType = "tag" | "custom";

type HTMLTag = any;

type Handler = Function;

interface VDOM {
  type: VDOMType;
  name: string;
  children?: VDOM[];
  id?: string;
}

interface Instance {
  name: string;
  id: string;
  as: HTMLTag;
  type: string;
  state?: Object;
}

interface Def {
  type: string;
  name: string;
  render: Handler;
  initialState?: Object;
  effect?: Handler | Handler[];
  subscribe?: string | string[];
  cases?: Handler;
}

const EOFOL_COMPONENT_TYPE_CUSTOM = "custom";
const EOFOL_COMPONENT_TYPE_FLAT = "flat";
const EOFOL_COMPONENT_TYPE_STATIC = "static";

let vdom: VDOM = { type: "tag", name: "initial" };
let instances: Instance[] = [];
const customDefs: Def[] = [];
const flatDefs: Def[] = [];
const staticDefs: Def[] = [];

const EOFOL_ERROR_MSG_PREFIX = "EOFOL ERROR - ";

const errorRuntime = (msg: string) => {
  console.log(`${EOFOL_ERROR_MSG_PREFIX}${msg}`);
};

const isBrowser = () =>
  typeof window !== "undefined" && typeof window.document !== "undefined";

const reduceHTMLProps = (props: any, prefix?: string, suffix?: string) =>
  props
    ? Object.keys(props).reduce((acc, next) => {
        const val = props[next].toString().replaceAll('"', "'");
        return `${acc} ${next}="${prefix ?? ""}${val}${suffix ?? ""}"`;
      }, "")
    : "";

const findGeneralDef = (generalDefs: any) => (tagname: string) =>
  generalDefs.find((def: any) => def.name === tagname);
const findCustomDef = findGeneralDef(customDefs);
const findFlatDef = findGeneralDef(flatDefs);
const findStaticDef = findGeneralDef(staticDefs);

const findDef = (tagname: string) =>
  findCustomDef(tagname) || findFlatDef(tagname) || findStaticDef(tagname);

const getContentHTML = (content: any): any => {
  if (!content) {
    return "";
  } else if (Array.isArray(content)) {
    return content.reduce((acc, next) => acc + getContentHTML(next), "");
  } else if (typeof content === "string") {
    return content;
  } else {
    return content;
  }
};

function createElement(
  tagname: string,
  content?: any,
  classname?: string,
  attributes?: any,
  properties?: any,
  props?: any,
) {
  // @TODO remove double findDef call
  const def = findDef(tagname);
  if (def) {
    // @TODO finish
    const id = "";
    renderEofolElement(tagname, props, id);
  } else {
    const classnameHTML = classname ? ` class='${classname}'` : "";
    const attributesHTML = reduceHTMLProps(attributes);
    const propertiesHTML = reduceHTMLProps(properties, "(", ")()");
    const contentHTML = getContentHTML(content);
    return `<${tagname}${classnameHTML}${attributesHTML}${propertiesHTML}>${contentHTML}</${tagname}>`;
  }
}

const defineCustomComponent = (componentDef: any) => {
  customDefs.push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_CUSTOM });
  return componentDef;
};
const defineFlatComponent = (componentDef: any) => {
  flatDefs.push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_FLAT });
  return componentDef;
};
const defineStaticComponent = (componentDef: any) => {
  staticDefs.push({ ...componentDef, type: EOFOL_COMPONENT_TYPE_STATIC });
  return componentDef;
};

const initEofol = () => {
  const htmlPageRaw = isBrowser()
    ? window.location.pathname.split("/").pop()
    : "";
  const page = (
    !htmlPageRaw || htmlPageRaw?.length === 0 ? "index" : htmlPageRaw
  ).split(".")[0];

  return isBrowser()
    ? Promise.all([
        fetch(`./eofol/${page}-vdom.json`),
        fetch(`./eofol/${page}-instances.json`),
      ])
        .then((res) => {
          return Promise.all([res[0].json(), res[1].json()]);
        })
        .then((res) => {
          vdom = res[0];
          instances = res[1];
          return true;
        })
    : Promise.all([undefined, undefined]);
};

const renderEofolElement = (name: string, props: any, id: string) => {
  const def = findDef(name);
  if (def) {
    const type = def.type;
    let result;
    switch (type) {
      case EOFOL_COMPONENT_TYPE_CUSTOM: {
        const thisInstance = instances.find(
          (instance: { id: string }) => instance.id === id,
        );
        const state = thisInstance?.state;
        result = def.render(
          state,
          (nextState: any) => {
            console.log("Dynamically compiled setState fired!");
            // @TODO Dynamically compiled setState
            if (thisInstance) {
              thisInstance.state = nextState;
              forceRerender();
            } else {
              errorRuntime(
                `Couldn't find component instance for name: ${name}.`,
              );
            }
          },
          props,
        );
        break;
      }
      case EOFOL_COMPONENT_TYPE_FLAT: {
        result = def.render(props);
        break;
      }
      case EOFOL_COMPONENT_TYPE_STATIC: {
        result = def.render();
        break;
      }
      default: {
        errorRuntime(
          `Invalid Eofol component type: ${type} for component with name: ${name}.`,
        );
        result = undefined;
      }
    }
    return result;
  } else {
    errorRuntime(`Couldn't find def for Eofol element with name = ${name}.`);
    return undefined;
  }
};

const forceRerender = () => {
  // @TODO Instead rather rerender VDOM from top level down
  instances?.forEach((child: any) => {
    const { id, name, props } = child;
    const target = isBrowser() ? document.getElementById(id) : null;
    if (target) {
      const rendered = renderEofolElement(name, props, id);
      if (rendered) {
        target.innerHTML = rendered;
      }
    }
  });
};

initEofol();

const randomString = () => (Math.random() + 1).toString(36).substring(7);

const registerServiceworker = () => {
  if (isBrowser() && "serviceWorker" in navigator) {
    navigator.serviceWorker.register(`./service-worker.js`);
  }
};

registerServiceworker();

export default {
  defineCustomComponent,
  defineFlatComponent,
  defineStaticComponent,
  isBrowser,
  forceRerender,
  createElement,
  randomString,
  vdom,
  instances,
  customDefs,
  flatDefs,
  staticDefs,
};
