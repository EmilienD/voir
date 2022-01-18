'use strict'

module.exports = async function (fastify) {
  fastify.post('/', async function (req, rep) {
    const { user, installation } = await req.services.user.createUser(req.body)
    rep.setAuthenticationToken(installation)
    return { user }
  })
  fastify.post('/token', { noPreloadUser: true }, async (req, rep) => {
    const { email, password } = req.body
    const maybe = await req.services.user.getAuthenticationToken({
      email,
      password,
      installationId: req.cookies['VOiR-installation'],
    })

    if (maybe) {
      const { user, installation } = maybe
      rep.setAuthenticationToken(installation)
      return { user }
    } else {
      rep.code(403)
      return null
    }
  })
  fastify.delete('/token', async (req, rep) => {
    await req.services.user.deleteAuthenticationToken({
      id: req.cookies['VOiR-installation'],
    })
    rep.unsetAuthenticationToken()
    rep.code(204)
  })
}
