import { KVNamespace } from '@cloudflare/workers-types'

declare global {
  const BASE_URL: string
  const CACHE_TTL: number
  const KV_CACHE: KVNamespace

  interface Config {
    baseUrl: string
    cacheTtl?: number
  }
}
