// @IMPORT-START
import Core from "../../eofol/core"

const { forceRerender, defineCustomComponent, defineFlatComponent, defineStaticComponent, generateId, createElement } =
  Core
// @IMPORT("../../eofol/core")
// @IMPORT-END

const serializeJS = (handler: () => void) => `(${handler})()`

const pushVal = (val: string, name: string, handler: (() => void) | string) => `var ${name} = ${val}; ${handler}`

const pushStateful = (props: any, state: any, setState: any, handler: any) => {
  const withProps = pushVal(JSON.stringify(props), "props", serializeJS(handler))
  const withSetState = pushVal(setState, "setState", withProps)
  return pushVal(JSON.stringify(state), "state", withSetState)
}

export const component1 = defineCustomComponent({
  name: "component1",
  render: (statex: any, setStatex: any, props: any) => {
    const button = createElement(
      "button",
      `(${statex.count}) - Component 1 - Force rerender - ${props.param}`,
      undefined,
      undefined,
      {
        onclick: pushStateful(props, statex, setStatex, () => {
          // @ts-ignore
          // eslint-disable-next-line no-undef
          setState({ count: Math.floor(Math.random() * 100) })
          // forceRerender()
        }),
      },
    )
    const otherButton = createElement("button", `Force rerender - ${props.param}`, undefined, undefined, {
      // @ts-ignore
      onclick: serializeJS(() => {
        console.log("(R)")
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
