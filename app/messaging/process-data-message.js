const util = require('util')
const { validateMessage } = require('./validate-message')
const { getCachedResponse, setCachedResponse, getCacheKey } = require('../cache')
const { cacheConfig, messageConfig } = require('../config')
const { sendMessage } = require('./send-message')
const { TYPE } = require('../constants/type')
const { VALIDATION } = require('../constants/errors')

const processDataMessage = async (message, receiver) => {
  try {
    console.log('Data request received:', util.inspect(message.body, false, null, true))

    validateMessage(message)

    const { body, messageId } = message
    const { category, value } = body

    const key = getCacheKey(category, value)
    const cachedResponse = await getCachedResponse(cacheConfig.cache, body, key)
    const response = cachedResponse ?? { data: 'response' }

    if (!cachedResponse) {
      await setCachedResponse(cacheConfig.cache, key, body, response)
    }

    await sendMessage(response, TYPE, messageConfig.dataQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
    console.log('Data request completed:', util.inspect(response, false, null, true))
  } catch (err) {
    console.error('Unable to process data request:', err)
    if (err.category === VALIDATION) {
      await receiver.deadLetterMessage(message)
    } else {
      await receiver.abandonMessage(message)
    }
  }
}

module.exports = {
  processDataMessage
}
