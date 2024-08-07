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
  body?: any
}

export type Instances = Record<string, Instance>

export type DefSaved = { name: string; type: string }

export type Def = DefSaved & (DefCustom | DefVirtual | DefFlat | DefStatic)

export interface DefInstanced {
  initialState?: State
  effect?: any //| Handler[]
  subscribe?: string | string[]
  constructor?: any
  getDerivedStateFromProps?: any
  componentMounted?: any
  beforeUpdate?: any
  componentUpdated?: any
  componentUnmounted?: any
  classname?: string
}

export interface DefConcerete {
  // @TODO typing render function
  render?: any
  memo?: boolean
}

export interface DefCustom extends DefConcerete, DefInstanced {
  renderCase?: any
  shouldComponentUpdate?: any
}

export interface DefFlat extends DefConcerete {
  classname?: string
}

export interface DefStatic extends DefConcerete {
  classname?: string
}

export interface DefVirtual extends DefInstanced {
  render?: any
  renderCase?: any
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
