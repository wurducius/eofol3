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
  internalLink,
  externalLink,
  sx,
} = Core
// @IMPORT("../../eofol/core")
// @IMPORT-END

export const component1 = defineCustomComponent("component1", {
  render: (statex: any, setStatex: any, props: any) => {
    const counter = createElement("h2", `You have clicked ${statex.count} times.`)
    const buttonIncrement = createElement("button", "+", "eofol-button", undefined, {
      onclick: handler(props, statex, setStatex, () => {
        // @ts-ignore eslint-disable-next-line no-undef
        setState({ count: state.count + 1 })
      }),
    })
    const buttonReset = createElement("button", "Reset", "eofol-button", undefined, {
      onclick: handler(props, statex, setStatex, () => {
        // @ts-ignore eslint-disable-next-line no-undef
        setState({ count: 0 })
      }),
    })
    const otherButton = createElement("button", "Force rerender", "eofol-button", undefined, {
      onclick: handlerSimple(() => {
        forceRerender()
      }),
    })
    return createElement("div", [counter, buttonIncrement, buttonReset, otherButton])
  },
  initialState: { count: 0 },
})

export const component2 = defineCustomComponent("component2", {
  render: () =>
    createElement(
      "div",
      [
        `Component 2 = ${generateId()}`,
        createElement("div", internalLink({ children: "Internal", href: "index.html" })),
        createElement("div", externalLink({ children: "External", href: "https://youtube.com" })),
      ],
      "col",
    ),
})

export const component3 = defineCustomComponent("component3", {
  render: () =>
    createElement("div", [
      createElement("flat", undefined, undefined, undefined, undefined, {
        param: "3",
      }),
      "Component 3",
    ]),
})

export const flatComponent = defineFlatComponent("flat", {
  render: (props: { param: string }) =>
    createElement("div", [
      createElement("button", "FLAT HELLO WORLD!!!", sx({ "background-color": "red" })),
      createElement("p", "OH YEAH"),
      createElement("static"),
      `Flat component VARIANT = ${props.param}`,
    ]),
})

export const staticComponent = defineStaticComponent("static", {
  render: () => [createElement("p", "STATIC HELLO WORLD!!!"), createElement("p", "OH YEAH"), "Static component"],
})

export const imgPhi = defineStaticComponent("img-phi", {
  render: () => [
    createElement("img", undefined, "phi m-t-lg m-b-lg border-radius", {
      src: "./assets/media/icons/phi.svg",
      alt: "Eofol logo - greek letter Phi",
      height: "128",
      width: "128",
    }),
  ],
})

export default {
  component1,
  component2,
  component3,
  flatComponent,
  staticComponent,
  imgPhi,
}
