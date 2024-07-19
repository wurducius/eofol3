export type VDOMType = "tag" | "custom"

export type HTMLTag = any

export interface VDOM {
  type: VDOMType
  name: string
  children?: VDOM[]
  id?: string
}

export interface Instance {
  name: string
  id: string
  // as: HTMLTag
  type?: string
  state?: State
  setState?: SetState
  props?: Props
}

export type Instances = Instance[]

export interface Def {
  type?: string
  name: string
  // @TODO typing render function
  render: any
  initialState?: State
  effect?: Handler | Handler[]
  subscribe?: string | string[]
  cases?: Handler
}

export type Defs = Def[]

export type StringRecord = Record<string, string>

export type Attributes = StringRecord

export type Props = StringRecord

export type Properties = StringRecord

export type State = Object

// eslint-disable-next-line no-unused-vars
export type SetState = (nextState: State) => void

export type JSONValue = JSONElement | string

export type JSONNode = JSONValue[] | JSONValue

export interface JSONElement {
  type: string
  attributes: Attributes
  content: JSONNode[]
}

// eslint-disable-next-line no-unused-vars
export type Func = (x: any) => any

// eslint-disable-next-line no-unused-vars
export type Handler = (x: any) => void
