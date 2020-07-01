export async function handleRequest(
  event: FetchEvent,
  config: Config,
): Promise<Response> {
  try {
    const { baseUrl, cacheTtl } = config
    const { request } = event
    const { pathname, search } = new URL(request.url)
    const url = new URL(baseUrl + pathname + search)

    return await fetch(url.toString(), {
      ...(cacheTtl ? { cf: { cacheTtl } } : {}),
      headers: {
        ...request.headers,
      },
    })
  } catch (err) {
    console.log(err.message)
    return new Response('Something went wrong', { status: 500 })
  }
}
