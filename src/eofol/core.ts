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

const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";

const reduceHTMLProps = (props: any, prefix?: string, suffix?: string) =>
  props
    ? Object.keys(props).reduce((acc, next) => {
        const val = props[next].toString().replaceAll('"', "'");
        return `${acc} ${next}="${prefix ?? ""}${val}${suffix ?? ""}"`;
      }, "")
    : "";

const findCustomDef = (tagname: string) =>
  customDefs.find((def: any) => def.name === tagname);
const findFlatDef = (tagname: string) =>
  flatDefs.find((def: any) => def.name === tagname);
const findDef = (tagname: string) =>
  findCustomDef(tagname) || findFlatDef(tagname);

const getContentHTML = (content: any) => {
  if (!content) {
    return "";
  } else if (Array.isArray(content)) {
    return content.reduce((acc, next) => acc + next, "");
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
  properties?: any
) {
  const def = findDef(tagname);
  if (def) {
    return def.render();
  } else {
    const classnameHTML = classname ? ` class='${classname}'` : "";
    const attributesHTML = reduceHTMLProps(attributes);
    const propertiesHTML = reduceHTMLProps(properties, "(", ")()");
    const contentHTML = getContentHTML(content);
    return `<${tagname}${classnameHTML}${attributesHTML}${propertiesHTML}>${contentHTML}</${tagname}>`;
  }
}

let vdom: any = undefined;
let instances: any = undefined;
let customDefs: any = [];
let flatDefs: any = [];

const defineCustomComponent = (componentDef: any) => {
  customDefs.push(componentDef);
  return componentDef;
};

const defineFlatComponent = (componentDef: any) => {
  flatDefs.push(componentDef);
  return componentDef;
};

const initEofol = () => {
  const htmlPageRaw = isBrowser
    ? window.location.pathname.split("/").pop()
    : "";
  const page = htmlPageRaw?.length === 0 ? "index" : htmlPageRaw;

  return isBrowser
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

const forceRerender = () => {
  instances?.forEach((child: any) => {
    const id = child.id;
    const name = child.name;
    const target = isBrowser ? document.getElementById(id) : null;
    if (target) {
      const def = findDef(name);
      if (def) {
        target.innerHTML = def.render();
      }
    }
  });
};

initEofol();

const randomString = () => (Math.random() + 1).toString(36).substring(7);

export default {
  defineCustomComponent,
  defineFlatComponent,
  isBrowser,
  forceRerender,
  createElement,
  randomString,
  vdom,
  instances,
  customDefs,
  flatDefs,
};
