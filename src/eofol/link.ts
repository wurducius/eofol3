import { EofolProps, LinkGenericProps, LinkParticularProps } from "./types"

// @IMPORT-START
import Tags from "./html"
const { a } = Tags
// @IMPORT("./html")
// @IMPORT-END

// @IMPORT-START
import EofolInternals from "./eofol-internals"

const { registerAsset } = EofolInternals
// @IMPORT("./eofol-internals")
// @IMPORT-END

// @IMPORT-START
import Common from "./common"
const { isBrowser } = Common
// @IMPORT("./common")
// @IMPORT-END

// @IMPORT-START
import Util from "./util"
const { ax } = Util
// @IMPORT("./util")
// @IMPORT-END

const link = ({ children, classname, href, external, download }: EofolProps & LinkGenericProps) => {
  if (!isBrowser()) {
    registerAsset(external ? "externalLink" : "internalLink", href)
  }
  return a(children, classname, ax({ href }, { target: external && "_blank", download }))
}

const internalLink = ({ children, classname, href, download }: EofolProps & LinkParticularProps) =>
  link({ children, classname, href, download })

const externalLink = ({ children, classname, href, download }: EofolProps & LinkParticularProps) =>
  link({ children, classname, href, external: true, download })

export default { link, internalLink, externalLink }
