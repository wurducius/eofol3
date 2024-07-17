export type VDOMType = "tag" | "custom"

export type HTMLTag = any

export type Handler = Function

export interface VDOM {
  type: VDOMType
  name: string
  children?: VDOM[]
  id?: string
}

export interface Instance {
  name: string
  id: string
  as: HTMLTag
  type?: string
  state?: Object
  setState?: any
  props?: Props
}

export type Instances = Instance[]

export interface Def {
  type?: string
  name: string
  render: Handler
  initialState?: Object
  effect?: Handler | Handler[]
  subscribe?: string | string[]
  cases?: Handler
}

export type Defs = Def[]

export type StringRecord = Record<string, string>

export type Attributes = StringRecord

export type Props = StringRecord

export type Properties = StringRecord

export type JSONValue = JSONElement | string

export type JSONNode = JSONValue[] | JSONValue

export interface JSONElement {
  type: string
  attributes: Attributes
  content: JSONNode[]
}
