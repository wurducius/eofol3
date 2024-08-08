// @IMPORT-START
import Components from "../components/components"
const { defineCustomComponent } = Components
// @IMPORT("../components/components")
// @IMPORT-END

// @IMPORT-START
import HandlerSerialize from "../api/handler-serialize"
const { handler } = HandlerSerialize
// @IMPORT("../api/handler-serialize")
// @IMPORT-END

// @IMPORT-START
import Fetch from "../api/fetch"
import { Method } from "../types"
const { fetchGeneral } = Fetch
// @IMPORT("../api/fetch")
// @IMPORT-END

// @IMPORT-START
import StateComponent from "../components/state-component"
const { skeleton, spinner, error } = StateComponent
// @IMPORT("../components/state-component")
// @IMPORT-END

const dataContainer = (name: string, { render, url, method }: { render: any; url: string; method?: Method }) =>
  defineCustomComponent(name, {
    renderCase: (statex: { data: string | undefined }) => {
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
          //  @ts-ignore
          // eslint-disable-next-line no-undef
          if (state.data === undefined) {
            //  @ts-ignore
            // eslint-disable-next-line no-undef
            setState({ data: "LOADING" })
            fetchGeneral(url, undefined, method ?? "GET", undefined, true)
              .then((res) => {
                //  @ts-ignore
                // eslint-disable-next-line no-undef
                setState({ data: res })
              })
              .catch((e) => {
                console.log(e)
                //  @ts-ignore
                // eslint-disable-next-line no-undef
                setState({ data: "ERROR" })
              })
          }
        }),
      ),
  })

export default { dataContainer }
