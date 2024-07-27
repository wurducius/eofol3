// @IMPORT-START
import Components from "./components"
const { defineCustomComponent } = Components
// @IMPORT("./components")
// @IMPORT-END

// @IMPORT-START
import HandlerSerialize from "./handler-serialize"
const { handler } = HandlerSerialize
// @IMPORT("./handler-serialize")
// @IMPORT-END

// @IMPORT-START
import Fetch from "./fetch"
import { Method } from "./types"
const { fetchGeneral } = Fetch
// @IMPORT("./fetch")
// @IMPORT-END

// @IMPORT-START
import StateComponent from "./state-component"
const { skeleton, spinner, error } = StateComponent
// @IMPORT("./state-component")
// @IMPORT-END

const dataContainer = (name: string, { render, url, method }: { render: any; url: string; method?: Method }) =>
  defineCustomComponent(name, {
    renderCase: (statex: any, setStatex: any, props: any) => {
      if (statex.data === undefined) {
        return () => skeleton("Ready")
      } else if (statex.data === "LOADING") {
        return () => spinner()
      } else if (statex.data === "ERROR") {
        return () => error("Fetch error")
      } else {
        return () => render(statex)
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
            fetchGeneral(url, undefined, method ?? "GET", undefined, true)
              .then((res) => {
                // @ts-ignore eslint-disable-next-line no-undef
                // eslint-disable-next-line no-undef
                setState({ data: res })
              })
              .catch((e) => {
                console.log(e)
                // @ts-ignore eslint-disable-next-line no-undef
                // eslint-disable-next-line no-undef
                setState({ data: "ERROR" })
              })
          }
        }),
      ),
  })

export default { dataContainer }
