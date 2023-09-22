const { get } = require('./get')
const { getRequestIndex } = require('./get-request-index')
const { update } = require('./update')

const setCachedResponse = async (cacheName, key, request, response) => {
  const cacheData = await get(cacheName, key)
  const requestIndex = getRequestIndex(cacheData, request)
  if (requestIndex !== -1) {
    cacheData.requests[requestIndex].response = response
  } else {
    cacheData.requests.push({ ...request, response })
  }
  console.log('Caching value')
  await update(cacheName, key, cacheData)
}

module.exports = {
  setCachedResponse
}
