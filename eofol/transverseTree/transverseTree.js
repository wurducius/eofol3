const { PATH_DIST2, DIRNAME_EOFOL_INTERNAL, FILENAME_COMPILE, DIRNAME_VIEWS } = require("../constants/paths")

const pushElement = (delta) => (rendered, index) => {
  delta.push({
    index,
    element: rendered,
  })
}

const invalidateRequireCache = () => {
  for (let cached in require.cache) {
    if (
      cached.includes(PATH_DIST2) &&
      ((cached.includes(DIRNAME_EOFOL_INTERNAL) && cached.includes(FILENAME_COMPILE)) || cached.includes(DIRNAME_VIEWS))
    ) {
      delete require.cache[cached]
    }
  }
}

const transverseTree = (tree, vdom, instances, defs) => {
  invalidateRequireCache()

  const {
    getEofolComponentType,
    validateEofolCustomElement,
    isEofolCustomElement,
    isEofolFlatElement,
    isEofolStaticElement,
    renderEofolCustomElement,
    renderEofolFlatElement,
    renderEofolStaticElement,
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
    const pushElementImpl = pushElement(delta)
    tree.content.forEach((child, index) => {
      if (isEofolCustomElement(child)) {
        validateEofolCustomElement(child)
        const rendered = renderEofolCustomElement(child, instances, defs)
        pushElementImpl(rendered, index)
        vdom[vdom.length - 1].id = rendered.attributes.id
      } else if (isEofolFlatElement(child)) {
        const rendered = renderEofolFlatElement(child, defs)
        pushElementImpl(rendered, index)
      } else if (isEofolStaticElement(child)) {
        const rendered = renderEofolStaticElement(child, defs)
        pushElementImpl(rendered, index)
      } else {
        return transverseTree(child, vdom[vdom.length - 1].children, instances, defs)
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

const traverseTreeAsync = (vdom, eofolInstances, eofolDefs) => (res) => {
  transverseTree(res, vdom, eofolInstances, eofolDefs)
  return res
}

module.exports = traverseTreeAsync
