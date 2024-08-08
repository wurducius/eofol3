const STORE_ID_GENERATED_LENGTH = 12

const generateString = (length) => () =>
  Array(length)
    .fill("")
    .map(() => Math.random().toString(36).charAt(2))
    .join("")

const generateId = generateString(STORE_ID_GENERATED_LENGTH)

const mergeDeep = (...objects) => {
  const isObject = (obj) => obj && typeof obj === "object"

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key]
      const oVal = obj[key]

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = oVal ?? pVal
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal)
      } else {
        prev[key] = oVal
      }
    })

    return prev
  }, {})
}

const logError = (msg) => {
  console.log(`Store error: ${msg}`)
}

const getCreateSelectorName = (source) => `${source}-${generateId()}`

const storeRegistry = {}

const getStore = (name) => storeRegistry[name]

const setStoreInstance = (name, nextStore) => {
  storeRegistry[name] = nextStore
  return nextStore
}

const createStore = (name, initialState) => {
  let prevStore = getStore(name)
  if (prevStore) {
    logError(`Cannot create store with name: ${name}, because it already exists.`)
  } else {
    return setStoreInstance(name, { state: initialState, projections: [] })
  }
}

const select = (name) => {
  const store = getStore(name)
  if (store) {
    return store.state
  } else {
    logError(`Cannot select from store with name: ${name}, because it does not exist.`)
  }
}

const createProjection = (name, source, projectionMapping) => {
  const sourceStore = getStore(source)
  if (sourceStore) {
    const initialState = select(source)
    const createdStore = createStore(name, projectionMapping(initialState))
    if (createdStore) {
      sourceStore.projections.push({ name, projection: projectionMapping })
      // setStore(source, sourceStore)
    }
  } else {
    logError(`Cannot create projection because source store with name: ${source} does not exist.`)
  }
}

// eslint-disable-next-line no-unused-vars
const createSelector = (source, projectionMapping) => {
  const name = getCreateSelectorName(source)
  createProjection(name, source, projectionMapping)
  return { name, selector: () => select(name) }
}

const setStore = (name, nextState) => {
  const store = getStore(name)

  if (store) {
    store.state = nextState

    // rerender

    store.projections.forEach(({ name: projectionName, projection }) => {
      setStore(projectionName, projection(store.state))
    })
  } else {
    logError(`Cannot set store state because store with name: ${name} does not exist.`)
  }
}

// eslint-disable-next-line no-unused-vars
const mergeStore = (name, nextState) => {
  const store = getStore(name)

  if (store) {
    setStore(name, mergeDeep(store.state, nextState))
  } else {
    logError(`Cannot set store state because store with name: ${name} does not exist.`)
  }
}

// const createSlice = (name, initialState, actions) => {}

postMessage("Store Worker ready.")
