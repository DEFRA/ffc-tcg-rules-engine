const Joi = require('joi')

module.exports = Joi.object({
  body: Joi.object().required()
}).required()
