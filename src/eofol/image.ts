import { EofolPropsWithoutChildren, ImageGenericProps, ImageParticularProps } from "./types"

// @IMPORT-START
import Tags from "./html"
const { img } = Tags
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
const { ax, cx } = Util
// @IMPORT("./util")
// @IMPORT-END

// @IMPORT-START
import Constants from "./constants"
const { ASSET_IMAGE_STATIC, ASSET_IMAGE_DYNAMIC } = Constants
// @IMPORT("./constants")
// @IMPORT-END

const mutatePath = (path: string) => {
  const isMutable = path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg")
  if (isMutable) {
    const split = path.split(".")
    // @TODO
    const breakpoint = "lg"
    return split.map((part, i) => (i === split.length - 2 ? `${part}-${breakpoint}` : part)).join(".")
  } else {
    return path
  }
}

const IMAGE_FALLBACK_DEFAULT = mutatePath("./eofol/fallback.png")

const image = ({ classname, src, alt, dynamic, h, w, fallback }: EofolPropsWithoutChildren & ImageGenericProps) => {
  const mutatedSrc = mutatePath(src)

  if (!isBrowser()) {
    registerAsset(dynamic ? ASSET_IMAGE_DYNAMIC : ASSET_IMAGE_STATIC, mutatedSrc)
  }
  return img(
    undefined,
    cx("img-loading", classname),
    ax(
      {
        src: mutatedSrc,
        alt,
        onerror: `this.onerror = null; this.src = "${fallback ?? IMAGE_FALLBACK_DEFAULT}";`,
        onload: `this.className = "${cx(classname)}"`,
      },
      { height: h, width: w },
    ),
  )
}

const imageStatic = (props: EofolPropsWithoutChildren & ImageParticularProps) => image({ ...props, dynamic: false })

const imageDynamic = (props: EofolPropsWithoutChildren & ImageParticularProps) => image({ ...props, dynamic: true })

export default { imageStatic, imageDynamic }
