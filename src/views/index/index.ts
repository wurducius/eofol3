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
  handlerSimple,
} = Core
// @IMPORT("../../eofol/core")
// @IMPORT-END

export const component1 = defineCustomComponent({
  name: "component1",
  render: (statex: any, setStatex: any, props: any) => {
    const counter = createElement("h2", `You have clicked ${statex.count} times.`)
    const buttonIncrement = createElement("button", "+", undefined, undefined, {
      onclick: handler(props, statex, setStatex, () => {
        // @ts-ignore eslint-disable-next-line no-undef
        setState({ count: state.count + 1 })
      }),
    })
    const buttonReset = createElement("button", "Reset", undefined, undefined, {
      onclick: handler(props, statex, setStatex, () => {
        // @ts-ignore eslint-disable-next-line no-undef
        setState({ count: 0 })
      }),
    })
    const otherButton = createElement("button", "Force rerender", undefined, undefined, {
      onclick: handlerSimple(() => {
        forceRerender()
      }),
    })
    return createElement("div", [counter, buttonIncrement, buttonReset, otherButton])
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
