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
  fetchGeneral,
} = Core
// @IMPORT("../../eofol/core")
// @IMPORT-END

export const component1 = defineCustomComponent({
  name: "component1",
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

export const component2 = defineCustomComponent({
  name: "component2",
  render: () =>
    createElement(
      "div",
      [
        `Component 2 = ${generateId()}`,
        createElement("div", internalLink({ children: "Internal", href: "indexx.html" })),
        createElement("div", externalLink({ children: "External", href: "https://youtube.com" })),
      ],
      "col",
    ),
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
      createElement("button", "FLAT HELLO WORLD!!!", sx({ "background-color": "red" })),
      createElement("p", "OH YEAH"),
      createElement("static"),
      `Flat component VARIANT = ${props.param}`,
    ]),
})

export const staticComponent = defineStaticComponent({
  name: "static",
  render: () => [createElement("p", "STATIC HELLO WORLD!!!"), createElement("p", "OH YEAH"), "Static component"],
})

export const imgPhi = defineStaticComponent({
  name: "img-phi",
  render: () => [
    createElement("img", undefined, "phi", {
      src: "./phi.svg",
      alt: "Eofol logo - greek letter Phi",
      height: "128",
      width: "128",
    }),
  ],
})

export const dataComponent = defineCustomComponent({
  name: "weather",
  renderCase: (statex: any, setStatex: any, props: any) => {
    if (statex.data === "ready") {
      return () => createElement("div", "Ready")
    } else if (statex.data === "LOADING") {
      return () => createElement("div", "Loading...")
    } else if (statex.data === "ERROR") {
      return () => createElement("div", "Error")
    } else {
      return (statey: any) => createElement("div", statey.data.latitude)
    }
  },
  initialState: { data: "ready" },
  effect: (statex, setStatex) =>
    eval(
      handler({}, statex, setStatex, () => {
        // @ts-ignore eslint-disable-next-line no-undef
        // eslint-disable-next-line no-undef
        if (state.data === "ready") {
          // @ts-ignore eslint-disable-next-line no-undef
          // eslint-disable-next-line no-undef
          setState({ data: "LOADING" })
          fetchGeneral(
            "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m",
            undefined,
            "GET",
            undefined,
            true,
          )
            .then((res) => {
              // @ts-ignore eslint-disable-next-line no-undef
              // eslint-disable-next-line no-undef
              setState({ data: res })
            })
            .catch(() => {
              // @ts-ignore eslint-disable-next-line no-undef
              // eslint-disable-next-line no-undef
              setState({ data: "ERROR" })
            })
        }
      }),
    ),
})

export default {
  component1,
  component2,
  component3,
  flatComponent,
  staticComponent,
  imgPhi,
  dataComponent,
}
