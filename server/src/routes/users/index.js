'use strict'

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (req) {
    return req.services.user.createUser(req.body)
  })
  fastify.get('/', async (req) => {
    return req.services.user.getAllUsers()
  })
  fastify.post('/login', async (req) => {
    const { email, password } = req.body
    const user = await req.services.user.verifyUser({ email, password })
    if (user) {
      return user
    } else {
      req.code(403)
      return null
    }
  })
}
