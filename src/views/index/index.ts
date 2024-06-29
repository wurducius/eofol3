// import "./index.css";

// @IMPORT-START
import Core from "../../eofol/core";
const { forceRerender, defineComponent, randomString, createElement } = Core;
// @IMPORT("../../eofol/core")
// @IMPORT-END

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

export default { component1, component2, component3 };
