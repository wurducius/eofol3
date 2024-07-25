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
  div,
  button,
  h2,
  p,
  img,
  imageStatic,
} = Core
// @IMPORT("../../eofol/core")
// @IMPORT-END

export const component1 = defineCustomComponent({
  name: "component1",
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
    return div([counter, buttonIncrement, buttonReset, otherButton])
  },
  initialState: { count: 0 },
  memo: true,
})

export const component2 = defineCustomComponent({
  name: "component2",
  render: () =>
    div(
      [
        `Component 2 = ${generateId()}`,
        div(internalLink({ children: "Internal", href: "indexx.html" })),
        div(externalLink({ children: "External", href: "https://youtube.com" })),
      ],
      "col",
    ),
  // shouldComponentUpdate: () => Math.random() > 0.5,
})

export const component3 = defineCustomComponent({
  name: "component3",
  render: () =>
    div([
      createElement("flat", undefined, undefined, undefined, undefined, {
        param: "3",
      }),
      "Component 3",
    ]),
})

export const flatComponent = defineFlatComponent({
  name: "flat",
  render: (props: { param: string }) =>
    div([
      button("FLAT HELLO WORLD!!!", sx({ "background-color": "red" })),
      p("OH YEAH"),
      createElement("static"),
      `Flat component VARIANT = ${props.param}`,
    ]),
})

export const staticComponent = defineStaticComponent({
  name: "static",
  render: () => [p("STATIC HELLO WORLD!!!"), p("OH YEAH"), "Static component"],
})

export const imgPhi = defineStaticComponent({
  name: "img-phi",
  render: () => [imageStatic({ src: "./phi.svg", alt: "Eofol logo", h: 128, w: 128, classname: "phi" })],
})

export const dataComponent = defineCustomComponent({
  name: "weather",
  renderCase: (statex: any, setStatex: any, props: any) => {
    if (statex.data === undefined) {
      return () => div("Ready")
    } else if (statex.data === "LOADING") {
      return () => div("Loading...")
    } else if (statex.data === "ERROR") {
      return () => div("Error")
    } else {
      return (statey: any) => div(statey.data.latitude)
    }
  },
  initialState: {},
  effect: (statex: any, setStatex: any) =>
    eval(
      handler({}, statex, setStatex, () => {
        // @ts-ignore eslint-disable-next-line no-undef
        // eslint-disable-next-line no-undef
        if (state.data === undefined) {
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
