// @IMPORT-START
import Core from "../../eofol/core";
const {
  forceRerender,
  defineCustomComponent,
  defineFlatComponent,
  defineStaticComponent,
  randomString,
  createElement,
  isBrowser,
} = Core;
// @IMPORT("../../eofol/core")
// @IMPORT-END

const onclick = () => {
  console.log("(R)");
  forceRerender();
};

const onclickSerialized = onclick.toString();

export const component1 = defineCustomComponent({
  name: "component1",
  render: () => {
    const button = createElement(
      "button",
      "Component 1 - Force rerender",
      undefined,
      undefined,
      {
        onclick: eval(onclickSerialized),
      }
    );
    return button;
  },
});

export const component2 = defineCustomComponent({
  name: "component2",
  render: () => `Component 2 = ${randomString()}`,
});

export const component3 = defineCustomComponent({
  name: "component3",
  render: function () {
    const rendered = createElement("div", [
      createElement("flat"),
      "Component 3",
    ]);
    return rendered;
  },
});

export const flatComponent = defineFlatComponent({
  name: "flat",
  render: function () {
    const rendered = createElement("div", [
      createElement("button", "FLAT HELLO WORLD!!!"),
      createElement("p", "OH YEAH"),
      createElement("static"),
      "Flat component",
    ]);
    return rendered;
  },
});

export const staticComponent = defineStaticComponent({
  name: "static",
  render: function () {
    const rendered = [
      createElement("p", "STATIC HELLO WORLD!!!"),
      createElement("p", "OH YEAH"),
      "Static component",
    ];
    return rendered;
  },
});

export default {
  component1,
  component2,
  component3,
  flatComponent,
  staticComponent,
};
