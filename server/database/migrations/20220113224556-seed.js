'use strict'

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function (db) {
  return db.createTable('users', {
    id: { type: 'string', primaryKey: true },
    email: { type: 'string', unique: true },
    password_hash: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  })
}

exports.down = function (db) {
  return db.dropTable('users')
}

exports._meta = {
  version: 1,
}
