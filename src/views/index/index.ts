// @IMPORT-START
import Core from "../../eofol/core"

const { forceRerender, defineCustomComponent, defineFlatComponent, defineStaticComponent, generateId, createElement } =
  Core
// @IMPORT("../../eofol/core")
// @IMPORT-END

const onclick = () => {
  console.log("(R)")
  forceRerender()
}

const onclickSerialized = onclick.toString()
const incrementCount = (state: { count: number }, setState: (nextState: { count: any }) => void) => () => {
  console.log("setState()")
  setState({ count: 1 })
  // console.log("setState - " + { count: state.count + 1 });
  // setState({ count: state.count + 1 });
}
const incrementCountSerialized = (state: { count: number }, setState: (nextState: { count: any }) => void) =>
  incrementCount(state, setState).toString()

export const component1 = defineCustomComponent({
  name: "component1",
  render: (state: any, setState: any, props: { param: string }) => {
    const button = createElement(
      "button",
      `(${state.count}) - Component 1 - Force rerender - ${props.param}`,
      undefined,
      undefined,
      {
        onclick: eval(
          (() => {
            setState({ count: 69 })
          }).toString(),
        ),
      },
    )
    const otherButton = createElement("button", `Force rerender - ${props.param}`, undefined, undefined, {
      onclick: eval(onclickSerialized),
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
