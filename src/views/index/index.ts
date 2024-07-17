// @IMPORT-START
import Core from "../../eofol/core"
const {
  forceRerender,
  defineCustomComponent,
  defineFlatComponent,
  defineStaticComponent,
  generateId,
  createElement,
  handler,
} = Core
// @IMPORT("../../eofol/core")
// @IMPORT-END

export const component1 = defineCustomComponent({
  name: "component1",
  render: (state: any, setStatex: any, props: any) => {
    const button = createElement(
      "button",
      `(${state.count}) - Component 1 - Force rerender - ${props.param}`,
      undefined,
      undefined,
      {
        onclick: handler(props, state, setStatex, () => {
          // @ts-ignore eslint-disable-next-line no-undef
          setState({ count: Math.floor(Math.random() * 100) })
        }),
      },
    )
    const otherButton = createElement("button", `Force rerender - ${props.param}`, undefined, undefined, {
      onclick: handler(undefined, undefined, undefined, () => {
        forceRerender()
      }),
    })
    return createElement("div", [button, otherButton])
  },
  initialState: { count: 0 },
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
