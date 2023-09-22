const Joi = require('joi')

const schema = Joi.object({
  port: Joi.number().default(3002),
  env: Joi.string().valid('development', 'test', 'production').default('development'),
  serviceName: Joi.string().default('Rules engine')
})

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  serviceName: process.env.SERVICE_NAME
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

const value = result.value

value.isDev = value.env === 'development'
value.isProd = value.env === 'production'

module.exports = value
