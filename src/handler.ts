const config = {
  baseUrl: typeof BASE_URL == 'undefined' ? null : BASE_URL,
  cacheTtl: typeof CACHE_TTL == 'undefined' ? null : CACHE_TTL,
}

export async function handleRequest(event: FetchEvent): Promise<Response> {
  try {
    const { request } = event
    const { pathname, search } = new URL(request.url)
    const url = new URL(config.baseUrl + pathname + search)

    return await fetch(url.toString(), {
      ...(config.cacheTtl ? { cf: { cacheTtl: Number(config.cacheTtl) } } : {}),
      headers: {
        ...request.headers,
      },
    })
  } catch (err) {
    console.log(err.message)
    return new Response('Something went wrong', { status: 500 })
  }
}
