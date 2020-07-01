const generateCacheKey = (request: Request): string => {
  const url = new URL(request.url)
  const apiKey = url.searchParams.get('api_key')
  return `${apiKey}:${url.pathname}`
}

const config: Config = {
  baseUrl: 'https://api.convertkit.com/v3/',
  cacheKey: generateCacheKey,
  expiration: 60,
}

export default config
