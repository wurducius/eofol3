// import "./index.css";
import { JSONToHTML } from "html-to-json-parser";

const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";

function createElement(tagname: string, content: any) {
  // return JSONToHTML({ type: tagname, content });
  return `<${tagname}>${content}</${tagname}>`;
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

const forceRerender = () => {
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
          console.log(rendered);
          //  target.textContent = target.innerHTML = "";
          //  target.appendChild(rendered);
          //target.textContent = rendered;
          target.innerHTML = rendered;
        }
      }
    }
  });
};

initEofol().then(() => {
  setInterval(() => {
    console.log("(R)");
    forceRerender();
  }, 2000);
});

const randomString = () => (Math.random() + 1).toString(36).substring(7);

export const component1 = defineComponent({
  name: "component1",
  render: () => "COMPONENT 1 CONTENT " + randomString(),
});

export const component2 = defineComponent({
  name: "component2",
  render: () => "COMPONENT 2 CONTENT" + randomString(),
});

export const component3 = defineComponent({
  name: "component3",
  render: function () {
    const rendered = createElement("div", "TRADAAA");
    console.log(rendered);
    return rendered;
  },
});

export default { component1, component2, component3 };
