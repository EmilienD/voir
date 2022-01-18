'use strict'

const fp = require('fastify-plugin')
const path = require('path')
const services = require('../services')
const repositories = require('../repositories')
const BetterSqlite3 = require('better-sqlite3')
const genericPool = require('generic-pool')

const shouldWrapInTransaction = (req, opts) => {
  const defaultWrapInTransaction = req.method !== 'GET'
  return opts.wrapInTransaction ?? defaultWrapInTransaction
}

const plugin = async (fastify, opts, done) => {
  const factory = {
    create: () => {
      const db = new BetterSqlite3(path.resolve(process.env.DB_PATH))
      db.pragma('journal_mode = WAL')
      return db
    },
    destroy: (db) => db.close(),
  }
  const poolOpts = { max: 10, min: 2 }
  const pool = genericPool.createPool(factory, poolOpts)
  fastify.addHook('preHandler', async (req) => {
    const db = await pool.acquire()
    req.db = db
    if (shouldWrapInTransaction(req, opts)) {
      db.prepare('BEGIN').run()
    }
    req.services = services(repositories(db))
  })
  fastify.addHook('onResponse', async (req, rep) => {
    if (rep.statusCode < 500 && shouldWrapInTransaction(req, opts)) {
      await req.db.prepare('COMMIT').run()
    }
    pool.release(req.db)
  })
  fastify.addHook('onError', async (req) => {
    if (shouldWrapInTransaction(req, opts)) {
      await req.db.prepare('ROLLBACK').run()
    }
  })
  fastify.addHook('onClose', async () => {
    await pool.drain().then(() => pool.clear())
  })
  done()
}

module.exports = fp(plugin, {
  name: 'services',
})
