// import "./index.css";

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

function createElement(
  tagname: string,
  content: any,
  classname?: string,
  attributes?: any,
  properties?: any
) {
  const def = defs.find((def: any) => def.name === tagname);
  if (def) {
    return def.render();
  } else {
    const classnameHTML = classname ? ` class='${classname}'` : "";
    const attributesHTML = reduceHTMLProps(attributes);
    const propertiesHTML = reduceHTMLProps(properties, "(", ")()");
    console.log(properties, propertiesHTML);

    return `<${tagname}${classnameHTML}${attributesHTML}${propertiesHTML}>${content}</${tagname}>`;
  }
}

let vdom: any = undefined;
let instances: any = undefined;
let defs: any = [];

const defineComponent = (componentDef: any) => {
  defs.push(componentDef);
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

export const forceRerender = () => {
  instances?.forEach((child: any) => {
    const id = child.id;
    const name = child.name;
    const target = isBrowser ? document.getElementById(id) : null;
    if (target) {
      const def = defs.find((componentDef: any) => componentDef.name === name);
      if (def) {
        const rendered = def.render();
        if (typeof rendered === "string") {
          // target.textContent = rendered;
          target.innerHTML = rendered;
        } else {
          //  target.textContent = target.innerHTML = "";
          //  target.appendChild(rendered);
          //target.textContent = rendered;
          target.innerHTML = rendered;
        }
      }
    }
  });
};

initEofol();

const randomString = () => (Math.random() + 1).toString(36).substring(7);

const onclick = () => {
  console.log("(R)");
  forceRerender();
};

const onclickSerialized = onclick.toString();

export const component1 = defineComponent({
  name: "component1",
  render: () => {
    const button = createElement(
      "button",
      "Force rerender",
      undefined,
      undefined,
      {
        onclick: eval(onclickSerialized),
      }
    );
    return button;
  },
});

export const component2 = defineComponent({
  name: "component2",
  render: () => `Component 2 = ${randomString()}`,
});

export const component3 = defineComponent({
  name: "component3",
  render: function () {
    const rendered = createElement(
      "div",
      createElement("component2", "TRADAAA")
    );
    return rendered;
  },
});

export default { component1, component2, component3, forceRerender };
