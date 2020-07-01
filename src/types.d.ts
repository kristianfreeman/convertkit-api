import { KVNamespace } from '@cloudflare/workers-types'

declare global {
  const KV_CACHE: KVNamespace

  interface Config {
    baseUrl: string
    cacheTtl?: number
  }
}
