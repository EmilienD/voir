'use strict'

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
    return fastify.services.user.createUser(request.body)
  })
  fastify.get('/', async (req, rep) => {
    return fastify.services.user.getAllUsers()
  })
}
