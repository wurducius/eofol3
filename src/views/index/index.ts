// @IMPORT-START
import Core from "../../eofol/core"
const {
  forceRerender,
  defineCustomComponent,
  defineFlatComponent,
  defineStaticComponent,
  defineVirtualComponent,
  generateId,
  createElement,
  handler,
  handlerSimple,
  internalLink,
  externalLink,
  sx,
  div,
  button,
  h2,
  p,
  imageStatic,
  dataContainer,
  e,
  clearCompileCache,
  getCompileCache,
} = Core
// @IMPORT("../../eofol/core")
// @IMPORT-END

export const component1 = defineCustomComponent("component1", {
  render: (statex: any, setStatex: any, props: any) => {
    const counter = h2(`You have clicked ${statex.count} times.`)
    const buttonIncrement = button("+", "eofol-button", undefined, {
      onclick: handler(props, statex, setStatex, () => {
        // @ts-ignore eslint-disable-next-line no-undef
        setState({ count: state.count + 1 })
      }),
    })
    const buttonReset = button("Reset", "eofol-button", undefined, {
      onclick: handler(props, statex, setStatex, () => {
        // @ts-ignore eslint-disable-next-line no-undef
        setState({ count: 0 })
      }),
    })
    const otherButton = button("Force rerender", "eofol-button", undefined, {
      onclick: handlerSimple(() => {
        forceRerender()
      }),
    })
    return div([
      counter,
      buttonIncrement,
      buttonReset,
      otherButton,
      createElement("flat", undefined, undefined, undefined, undefined, { param: "2" }),
      // @ts-ignore  eslint-disable-next-line no-undef
      statex.count % 2 === 0 && e("next", "cksjoisjfio"),
    ])
  },
  initialState: { count: 0 },
  memo: true,
})

export const component2 = defineCustomComponent("component2", {
  render: () =>
    div(
      [
        `Component 2 = ${generateId()}`,
        div(internalLink({ children: "Internal", href: "indexx.html" })),
        div(externalLink({ children: "External", href: "https://youtube.com" })),
      ],
      "col",
    ),
})

export const component3 = defineCustomComponent("component3", {
  render: () =>
    div([
      createElement("flat", undefined, undefined, undefined, undefined, {
        param: "2",
      }),
      "Component 3",
    ]),
})

export const flatComponent = defineFlatComponent("flat", {
  render: (props: { param: string }) =>
    div([
      button("FLAT HELLO WORLD!!!", sx({ "background-color": "red" })),
      p("OH YEAH"),
      createElement("static"),
      `Flat component VARIANT = ${props.param}`,
    ]),
  memo: true,
})

export const staticComponent = defineStaticComponent("static", {
  render: () => [p("STATIC HELLO WORLD!!!"), p("OH YEAH"), "Static component"],
})

export const imgPhi = defineStaticComponent("img-phi", {
  render: () => [
    imageStatic({ src: "./assets/media/icons/phi.svg", alt: "Eofol logo", h: 128, w: 128, classname: "phi" }),
  ],
})

export const staticNextComponent = defineCustomComponent("next", {
  render: () => [p(`Next!!! ${generateId()}`)],
})

export const dataComponent = dataContainer("weather", {
  render: (statey: any) => div([statey.data.latitude, e("next", "abcdefghijkl"), e("next", "qwertyuiop")]),
  url: "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m",
})

export const hookComponent = defineVirtualComponent("hook", {
  initialState: { initialized: false },
  // render: (statex: any, setStatex: any) => "tada " + statex.initialized,
  effect: (statex: any, setStatex: any) =>
    eval(
      handler({}, statex, setStatex, () => {
        console.log("hook")
        // @ts-ignore
        if (!state.initialized) {
          // @ts-ignore
          setState({ initialized: true })
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
  hookComponent,
  staticNextComponent,
  clearCompileCache,
  getCompileCache,
  sx,
}
