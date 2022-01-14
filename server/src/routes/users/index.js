'use strict'

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
    return request.services.user.createUser(request.body)
  })
  fastify.get('/', async (req, rep) => {
    return req.services.user.getAllUsers()
  })
}
