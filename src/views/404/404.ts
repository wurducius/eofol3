// @IMPORT-START
import Core from "../../eofol/core"
const { isBrowser, defineCustomComponent, createElement, forceRerender, internalLink, getConfig } = Core
// @IMPORT("../../eofol/core")
// @IMPORT-END

let initialized = false

export const component404content = defineCustomComponent("404-content", {
  render: () => {
    const page = isBrowser() ? window.location.pathname.replace("/", "") : "unknown"
    return createElement(
      "div",
      [
        createElement("h2", `The requested page "${page}" doesn't exist.`),
        internalLink({ children: "Go back", href: "javascript:history.back()", classname: "m-t-lg" }),
        // @ts-ignore
        internalLink({ children: "Go to index", href: getConfig().BASE_URL ?? "/", classname: "m-t-md" }),
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

export default { component404content }
