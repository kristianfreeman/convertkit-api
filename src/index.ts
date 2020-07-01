import config from './config'
import { handleRequest } from './handler'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event, config))
})
