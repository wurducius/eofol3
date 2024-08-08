const path = require("path")
const {
  PATH_VIEWS_DIST2,
  EXT_JS,
  PATH_DIST2,
  DIRNAME_EOFOL_INTERNAL,
  FILENAME_COMPILE,
  FILENAME_SUFFIX_STATIC,
} = require("../constants")

const pushElement = (delta, sxStyles, view) => (rendered, index) => {
  const Sx = require(path.resolve(PATH_VIEWS_DIST2, view, path.basename(`${view}${FILENAME_SUFFIX_STATIC}${EXT_JS}`)))
  const { getCompileCache, clearCompileCache } = Sx
  sxStyles.push(getCompileCache())
  clearCompileCache()
  delta.push({
    index,
    element: rendered,
  })
}

const invalidateRequireCache = () => {
  for (let cached in require.cache) {
    if (
      cached.includes(PATH_DIST2) &&
      cached.includes(DIRNAME_EOFOL_INTERNAL) &&
      cached.includes(FILENAME_COMPILE) //|| cached.includes(DIRNAME_VIEWS))
    ) {
      delete require.cache[cached]
    }
  }
}

const transverseTree = (tree, vdom, instances, memoCache, defs, sxStyles, view) => {
  invalidateRequireCache()

  const {
    getEofolComponentType,
    validateEofolCustomElement,
    isEofolCustomElement,
    isEofolFlatElement,
    isEofolStaticElement,
    isEofolVirtualElement,
    renderEofolCustomElement,
    renderEofolFlatElement,
    renderEofolStaticElement,
    renderEofolVirtualElement,
  } = require("../../dist2/eofol/compile")

  const isContentNode = tree.type === undefined
  if (isContentNode) {
    return
  }

  const hasChildren =
    tree && tree.content && Array.isArray(tree.content) && tree.content.filter((x) => x.type !== undefined).length > 0
  const nextChildren = hasChildren ? [] : undefined

  let nextVdom
  if (tree.type === "eofol") {
    nextVdom = {
      type: "custom",
      name: getEofolComponentType(tree),
      children: nextChildren,
    }
  } else {
    nextVdom = {
      type: "tag",
      name: tree.type,
      children: nextChildren,
    }
  }

  vdom.push(nextVdom)

  if (hasChildren) {
    let delta = []
    const pushElementImpl = pushElement(delta, sxStyles, view)
    tree.content.forEach((child, index) => {
      if (isEofolCustomElement(child)) {
        validateEofolCustomElement(child)
        const rendered = renderEofolCustomElement(child, instances, memoCache, defs)
        pushElementImpl(rendered, index)
        vdom[vdom.length - 1].id = rendered.attributes.id
      } else if (isEofolFlatElement(child)) {
        const rendered = renderEofolFlatElement(child, memoCache, defs)
        pushElementImpl(rendered, index)
      } else if (isEofolStaticElement(child)) {
        const rendered = renderEofolStaticElement(child, memoCache, defs)
        pushElementImpl(rendered, index)
      } else if (isEofolVirtualElement(child)) {
        const rendered = renderEofolVirtualElement(child, instances, memoCache, defs)
        pushElementImpl(rendered, index)
      } else {
        return transverseTree(child, vdom[vdom.length - 1].children, instances, memoCache, defs, sxStyles, view)
      }
    })
    delta.forEach((deltaElement) => {
      tree.content[deltaElement.index] = Array.isArray(deltaElement.element)
        ? deltaElement.element.reduce((acc, next) => acc + next, "")
        : deltaElement.element
    })
  }
  return tree
}

const traverseTreeAsync = (vdom, eofolInstances, memoCache, eofolDefs, sxStyles, view) => (res) => {
  transverseTree(res, vdom, eofolInstances, memoCache, eofolDefs, sxStyles, view)
  return res
}

module.exports = traverseTreeAsync
