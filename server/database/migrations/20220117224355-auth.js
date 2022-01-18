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
  // Both user_id and id are primary keys because the same browser
  // could have two different users on it
  return db.createTable('installations', {
    id: {
      type: 'string',
      primaryKey: true,
    },
    user_id: {
      type: 'string',
      primaryKey: true,
      foreignKey: {
        name: 'user_installations_fk',
        table: 'users',
        mapping: 'id',
      },
    },
    token: { type: 'string' },
    created_at: {
      type: 'string',
    },
    updated_at: {
      type: 'string',
    },
  })
}

exports.down = function (db) {
  return db.dropTable('installations')
}

exports._meta = {
  version: 1,
}
