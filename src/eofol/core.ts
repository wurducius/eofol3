type VDOMType = "tag" | "custom";

type HTMLTag = any;

interface VDOM {
  type: VDOMType;
  name: string;
  children?: VDOM[];
  id?: string;
}

interface Instances {
  name: string;
  id: string;
  as: HTMLTag;
}

interface Def {
  type: string;
  name: string;
  children?: VDOM[];
}

let vdom: any = undefined;
let instances: any = undefined;
const customDefs: any = [];
const flatDefs: any = [];
const staticDefs: any = [];

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

const resolveContent = (content: any): any => {
  if (!content) {
    return "";
  } else if (Array.isArray(content)) {
    return content.reduce((acc, next) => acc + resolveContent(next), "");
  } else if (typeof content === "string") {
    return content;
  } else {
    return content;
  }
};

const getContentHTML = (content: any) => resolveContent(content);

function createElement(
  tagname: string,
  content?: any,
  classname?: string,
  attributes?: any,
  properties?: any,
  props?: any,
) {
  const def = findDef(tagname);
  if (def) {
    return def.render(props);
  } else {
    const classnameHTML = classname ? ` class='${classname}'` : "";
    const attributesHTML = reduceHTMLProps(attributes);
    const propertiesHTML = reduceHTMLProps(properties, "(", ")()");
    const contentHTML = getContentHTML(content);
    return `<${tagname}${classnameHTML}${attributesHTML}${propertiesHTML}>${contentHTML}</${tagname}>`;
  }
}

const defineCustomComponent = (componentDef: any) => {
  customDefs.push({ ...componentDef, type: "custom" });
  return componentDef;
};
const defineFlatComponent = (componentDef: any) => {
  flatDefs.push({ ...componentDef, type: "flat" });
  return componentDef;
};
const defineStaticComponent = (componentDef: any) => {
  staticDefs.push({ ...componentDef, type: "static" });
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
      case "custom": {
        const thisInstance = instances.find(
          (instance: { id: string }) => instance.id === id,
        );
        const state = thisInstance?.state;
        result = def.render(
          state,
          (nextState: any) => {
            // @TODO Statically compiled setState
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
        );
        break;
      }
      case "flat": {
        result = def.render(props);
        break;
      }
      case "static": {
        result = def.render();
        break;
      }
      default: {
        console.log(
          `EOFOL ERROR - Invalid Eofol component type: ${type} for component with name: ${name}.`,
        );
        result = undefined;
      }
    }
    return result;
  } else {
    console.log(
      "EOFOL ERROR - Couldn't find def for Eofol element with name = " + name,
    );
    return undefined;
  }
};

const forceRerender = () => {
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

const postInitEofol = (eofolInternals: boolean | Awaited<undefined>[]) => {
  // @ts-ignore
  const vdom = eofolInternals[0];
  // @ts-ignore
  const instances = eofolInternals[1];

  // TODO play initial render effects
};

initEofol().then(postInitEofol);

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
