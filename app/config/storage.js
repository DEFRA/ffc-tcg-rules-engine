const Joi = require('joi')

const schema = Joi.object({
  connectionStr: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  useConnectionStr: Joi.boolean().default(false),
  container: Joi.string().default('data')
})

const config = {
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  useConnectionStr: process.env.AZURE_STORAGE_USE_CONNECTION_STRING === 'true',
  container: process.env.AZURE_STORAGE_CONTAINER
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
