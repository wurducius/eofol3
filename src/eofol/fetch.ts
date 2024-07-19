type HeadersType = Record<string, string>

type Method = "GET" | "POST" | "PUT" | "HEAD" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH"

type Body = Object | string | undefined

const headersBase: HeadersType = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

const headersCors: HeadersType = {
  "Access-Control-Allow-Origin": "*",
}

const appendHeaders = (headersTarget: Headers, headersObj: HeadersType) => {
  Object.keys(headersObj).forEach((headerName) => {
    headersTarget.append(headerName, headersObj[headerName])
  })
}

const fetchGeneral = (url: string, body?: Body, method?: Method, headers?: HeadersType, cors?: boolean) => {
  const bodyImpl = typeof body === "object" ? JSON.stringify(body) : body

  const headersImpl = new Headers()
  appendHeaders(headersImpl, headersBase)
  if (cors) {
    appendHeaders(headersImpl, headersCors)
  }
  if (headers) {
    appendHeaders(headersImpl, headers)
  }

  return fetch(url, {
    method: method ?? "GET",
    body: bodyImpl,
    headers: headersImpl,
    mode: cors ? "cors" : "no-cors",
  }).then((res) => {
    const contentType = res && res.headers && res.headers.get("content-type")
    return contentType && contentType.includes("application/json") ? res.json() : res
  })
}

const get = (url: string) => fetchGeneral(url)

const post = (url: string, body?: Object | string) => fetchGeneral(url, body, "POST")

export default { get, post, fetchGeneral }
