import { KVNamespace } from '@cloudflare/workers-types'

declare global {
  const KV_CACHE: KVNamespace

  interface Config {
    baseUrl: string
    cacheKey: (request: Request) => string
    expiration: number
  }
}
