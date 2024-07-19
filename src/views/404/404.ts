// @IMPORT-START
import Core from "../../eofol/core"
const { isBrowser, defineCustomComponent, createElement, forceRerender, internalLink } = Core
// @IMPORT("../../eofol/core")
// @IMPORT-END

let initialized = false

export const staticComponent = defineCustomComponent({
  name: "static",
  render: () => {
    const page = isBrowser() ? window.location.pathname.replace("/", "") : "unknown"
    return createElement(
      "div",
      [
        createElement("h3", `The requested page "${page}" doesn't exist.`),
        internalLink({ children: "Go back", href: "javascript:history.back()", classname: "spacing-l" }),
        internalLink({ children: "Go to index", href: "/", classname: "spacing-l" }),
      ],
      "col",
    )
  },
})

if (!initialized && isBrowser()) {
  initialized = true
  const prevOnload = window.onload
  window.onload = () => {
    if (prevOnload) {
      // @ts-ignore
      prevOnload()
    }
    forceRerender()
  }
}

export default { staticComponent }
