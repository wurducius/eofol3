// @IMPORT-START
import Core from "../../eofol/core"

const { forceRerender, defineCustomComponent, defineFlatComponent, defineStaticComponent, createElement, generateId } =
  Core
// @IMPORT("../../eofol/core")
// @IMPORT-END

const onclick = () => {
  forceRerender()
}

const onclickSerialized = onclick.toString()

export const component1 = defineCustomComponent({
  name: "component1",
  render: (state: any, setState: any, props: { param: string }) =>
    createElement("button", `Component 1 - Force rerender - ${props.param}`, undefined, undefined, {
      onclick: eval(onclickSerialized),
    }),
})

export const component2 = defineCustomComponent({
  name: "component2",
  render: () => `Component 2 = ${generateId()}`,
})

export const component3 = defineCustomComponent({
  name: "component3",
  render: () =>
    createElement("div", [
      createElement("flat", undefined, undefined, undefined, undefined, {
        param: "3",
      }),
      "Component 3",
    ]),
})

export const flatComponent = defineFlatComponent({
  name: "flat",
  render: (props: { param: string }) =>
    createElement("div", [
      createElement("button", "FLAT HELLO WORLD!!!"),
      createElement("p", "OH YEAH"),
      createElement("static"),
      `Flat component VARIANT = ${props.param}`,
    ]),
})

export const staticComponent = defineStaticComponent({
  name: "static",
  render: () => [createElement("p", "STATIC HELLO WORLD!!!"), createElement("p", "OH YEAH"), "Static component"],
})

export default {
  component1,
  component2,
  component3,
  flatComponent,
  staticComponent,
}
