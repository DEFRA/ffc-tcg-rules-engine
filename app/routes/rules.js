const { runRules } = require('../rules-engine')

module.exports = {
  method: 'GET',
  path: '/rules',
  handler: async (request, h) => {
    const result = await runRules(123456780)
    return h.response(result).code(200)
  }
}
