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
  type?: string
  state?: State
  props?: Props
  // as: HTMLTag
  renderCache?: string
  memo?: any
}

export type Instances = Record<string, Instance>

export interface Def extends DefDeclaration {
  name: string
}

export interface DefDeclaration {
  type?: string
  // @TODO typing render function
  render?: any
  initialState?: State
  effect?: any //| Handler[]
  subscribe?: string | string[]
  renderCase?: any
  shouldComponentUpdate?: any
  memo?: boolean
}

export type Defs = Def[]

export type StringRecord = Record<string, string>

export type Attributes = StringRecord

export type Props = StringRecord

export type Properties = StringRecord

export type State = Object

export type SetState = (nextState: State) => void

export type JSONValue = JSONElement | string

export type JSONNode = JSONValue[] | JSONValue

export interface JSONElement {
  type: string
  attributes: Attributes
  content: JSONNode[]
}

export type Func = (x: any) => any

export type Handler = (x: any) => void

export type EofolPropsWithoutChildren = {
  classname?: string
}

export type EofolProps = EofolPropsWithoutChildren & {
  children?: JSONNode
}

// --------

export type ImageParticularProps = {
  src: string
  alt: string
  h?: string | number
  w?: string | number
  fallback?: string
}

export type ImageGenericProps = ImageParticularProps & {
  dynamic?: boolean
}

export type LinkParticularProps = {
  href: string
  download?: string
}

export type LinkGenericProps = LinkParticularProps & {
  external?: boolean
}

// --------------

export type Method = "GET" | "POST" | "PUT" | "HEAD" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH"
