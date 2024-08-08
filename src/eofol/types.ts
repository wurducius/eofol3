export type VDOMType = "tag" | "custom"

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
  memo?: boolean
  body?: unknown
}

export type Instances = Record<string, Instance>

export type MemoCacheItem = { rendered: string }

export type MemoCacheStatic = Record<string, MemoCacheItem>

export type MemoCacheFlat = Record<string, Record<string, MemoCacheItem>>

export type MemoCacheCustom = Record<string, Record<string, Record<string, MemoCacheItem>>>

export type MemoCache = MemoCacheStatic | MemoCacheFlat | MemoCacheCustom

export type Config = { BASE_URL: string }

export type Asset = { url: string; status: string | undefined }

export type Assets = Record<string, Asset[]>

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

export type State = unknown

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
