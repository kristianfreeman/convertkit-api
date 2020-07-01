interface MarshalledResponse {
  data?: string
  ok: boolean
  status: number
  headers: { [key: string]: string }
  text: string
}

const marshalResponse = async (
  response: Response,
): Promise<MarshalledResponse> => {
  const resp = response.clone()
  const text = await resp.json()
  const { ok, status } = resp

  const headers: { [key: string]: string } = {}
  for (const pair of resp.headers.entries()) {
    const [key, value] = pair
    headers[key] = value
  }

  return {
    data: JSON.stringify(text),
    headers,
    ok,
    status,
    text,
  }
}

export async function handleRequest(
  event: FetchEvent,
  config: Config,
): Promise<Response> {
  try {
    const { request } = event
    const incomingUrl = new URL(request.url)
    const shouldCache =
      !!incomingUrl.searchParams.get('api_key') && request.method == 'GET'
    const cacheKey = config.cacheKey(request)
    const cachedData = await KV_CACHE.get(cacheKey)
    if (shouldCache && cachedData) {
      const cached: MarshalledResponse = JSON.parse(cachedData)
      const cachedResp = new Response(cached.data || cached.text, { ...cached })
      cachedResp.headers.set('Edge-Cached', 'true')
      return cachedResp
    } else {
      const url = new URL(
        config.baseUrl + incomingUrl.pathname + incomingUrl.search,
      )
      const resp = await fetch(url.toString(), {
        headers: request.headers,
      })
      const clonedResp = new Response(resp.body, resp)
      if (shouldCache) {
        const respForCache = await marshalResponse(clonedResp)
        event.waitUntil(
          KV_CACHE.put(cacheKey, JSON.stringify(respForCache), {
            expirationTtl: config.expiration,
          }),
        )
      }
      clonedResp.headers.set('Edge-Cached', 'false')
      return clonedResp
    }
  } catch (err) {
    console.log(err)
    return new Response('Something went wrong', { status: 500 })
  }
}
