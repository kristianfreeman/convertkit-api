import { expect } from 'chai'
import { handleRequest } from '../src/handler'
import config from '../src/config'

describe('handler returns response with request method', () => {
  const methods = [
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'DELETE',
    'CONNECT',
    'OPTIONS',
    'TRACE',
    'PATCH',
  ]
  methods.forEach(method => {
    it(method, async () => {
      const evt = new FetchEvent('fetch', {
        request: new Request('/', { method }),
      })
      const result = await handleRequest(evt, config)
      const text = await result.text()
      expect(text).to.include(method)
    })
  })
})
