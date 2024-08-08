const createPage = (pathname, content) => {}

const createTemplate = (pathname, template) => {}

const createComponent = (defs, name, componentDef, type) => {
  const def = { ...componentDef, type, name }
  defs.push(def)
}

module.exports = { createPage, createTemplate, createComponent }
