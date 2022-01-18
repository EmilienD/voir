'use strict'

const fp = require('fastify-plugin')

module.exports = fp(
  async (fastify, opts, done) => {
    const voirSessionCookieName = opts.cookieSecure
      ? '__Host-VOiR-session'
      : 'VOiR-session'
    const setSessionCookie = (rep, installation) => {
      const expires = new Date()
      expires.setFullYear(expires.getFullYear() + 1)
      rep.setCookie(voirSessionCookieName, installation.token, {
        sameSite: 'strict',
        expires,
        httpOnly: true,
        secure: true,
        path: '/',
      })
      rep.setCookie('VOiR-installation', installation.id, {
        sameSite: 'strict',
        expires,
        httpOnly: true,
        secure: true,
        path: '/',
      })
    }
    fastify.addHook('preHandler', async (req) => {
      req.authenticatedUser = await req.services.user.getUserByToken(
        req.cookies[voirSessionCookieName]
      )
    })
    fastify.decorateReply('setAuthenticationToken', function (installation) {
      setSessionCookie(this, installation)
    })
    fastify.decorateReply('unsetAuthenticationToken', function () {
      this.clearCookie(voirSessionCookieName, {
        path: '/',
        httpOnly: true,
        secure: opts.cookieInstallationSecure,
      })
    })
    done()
  },
  {
    fastify: '3.x',
    dependencies: ['services'],
    name: 'auth',
  }
)
