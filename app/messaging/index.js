const { MessageReceiver } = require('ffc-messaging')
const { messageConfig } = require('../config')
const { processDataMessage } = require('./process-data-message')
let dataReceiver

const start = async () => {
  const action = message => processDataMessage(message, dataReceiver)
  dataReceiver = new MessageReceiver(messageConfig.dataSubscription, action)
  await dataReceiver.subscribe()
  console.info('Ready to receive messages')
}

const stop = async () => {
  await dataReceiver.closeConnection()
}

module.exports = { start, stop }
