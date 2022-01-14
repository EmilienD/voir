'use strict'

const fp = require('fastify-plugin')
const path = require('path')
const Promise = require('bluebird')
const services = require('../services')
const repositories = require('../repositories')

module.exports = fp(async (fastify, opts, done) => {
  const sqlite3 = require('sqlite3').verbose()

  const db = Promise.promisifyAll(
    new sqlite3.Database(
      path.resolve(__dirname, '../../../db/voir.db'),
      (err) => {
        if (err) {
          console.error(err.message)
        }
      }
    )
  )
  fastify.decorate('services', services(repositories(db)))
  done()
})
