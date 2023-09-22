const Joi = require('joi')

const schema = Joi.object({
  messageQueue: {
    host: Joi.string().required(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object()
  },
  dataSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().valid('subscription', 'topic').default('subscription')
  },
  responseQueue: {
    address: Joi.string()
  }
})
const config = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === 'production',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  dataSubscription: {
    address: process.env.DATA_SUBSCRIPTION_ADDRESS,
    topic: process.env.DATA_TOPIC_ADDRESS,
    type: 'subscription'
  },
  responseQueue: {
    address: process.env.RESPONSE_QUEUE_ADDRESS
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The message queue config is invalid. ${result.error.message}`)
}

const dataSubscription = { ...result.value.messageQueue, ...result.value.dataSubscription }
const responseQueue = { ...result.value.messageQueue, ...result.value.responseQueue }

module.exports = {
  dataSubscription,
  responseQueue
}
